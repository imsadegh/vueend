<script setup lang="ts">
import { API_BASE_URL } from '@/config/config'
import axios from 'axios'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const token = useCookie('accessToken').value

// Data state
interface Instructor {
  id: number
  first_name: string
  last_name: string
}

interface Course {
  id: number
  course_name: string
  course_code: string
  status: string
  visibility: boolean
  featured: boolean
  description: string
  about: string
  discussion_group_url: string
  allow_waitlist: boolean
  start_date: string | null
  end_date: string | null
  tags: string[]
  thumbnail_url: string
  instructor?: Instructor
  instructor_id?: number
  enrollments_count?: number
}

const allCourses = ref<Course[]>([])
const totalCourses = ref(0)
const isLoading = ref(false)
const searchQuery = ref('')
const statusFilter = ref<string | null>(null)
const isDialogVisible = ref(false)
const selectedCourseId = ref<number | null>(null)

// Form state for editing
const course_name = ref('')
const capacity = ref('')
const visibility = ref('false')
const featured = ref(false)
const description = ref('')
const about = ref('')
const discussion_group_url = ref('')
const status = ref('draft')
const allow_waitlist = ref(false)
const start_date = ref<Date | null>(null)
const end_date = ref<Date | null>(null)
const tags = ref([])
const thumbnail_url = ref('')
const errors = ref<Record<string, string>>({})

// Status options for filter
const statusOptions = [
  { title: $t('admin.allStatuses'), value: null },
  { title: $t('course.active'), value: 'active' },
  { title: $t('course.draft'), value: 'draft' },
  { title: $t('course.archived'), value: 'archived' },
]

// Fetch all courses (admin endpoint)
const fetchAllCourses = async () => {
  isLoading.value = true
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/courses`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        search: searchQuery.value || undefined,
        status: statusFilter.value || undefined,
      },
    })
    allCourses.value = response.data.data || response.data
    totalCourses.value = response.data.total || allCourses.value.length
  }
  catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching all courses:', error.response?.data || error.message)
    }
    else {
      console.error('Error fetching all courses:', error)
    }
  }
  finally {
    isLoading.value = false
  }
}

// Open modal and load selected course details
const openEditDialog = async (courseId: number) => {
  isDialogVisible.value = true
  selectedCourseId.value = courseId

  try {
    const response = await axios.get(`${API_BASE_URL}/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const course = response.data
    course_name.value = course.course_name
    capacity.value = course.capacity
    visibility.value = course.visibility ? 'true' : 'false'
    featured.value = course.featured
    description.value = course.description
    about.value = course.about
    discussion_group_url.value = course.discussion_group_url
    status.value = course.status
    allow_waitlist.value = course.allow_waitlist
    start_date.value = course.start_date ? new Date(course.start_date) : null
    end_date.value = course.end_date ? new Date(course.end_date) : null
    tags.value = course.tags || []
    thumbnail_url.value = course.thumbnail_url
  }
  catch (error) {
    const err = error as any
    console.error('Error loading course details:', err.response?.data || err.message)
  }
}

// Update course details
const updateCourse = async () => {
  errors.value = {}

  try {
    await axios.put(
      `${API_BASE_URL}/courses/${selectedCourseId.value}`,
      {
        course_name: course_name.value,
        capacity: capacity.value ? parseInt(capacity.value) : null,
        visibility: visibility.value === 'true',
        featured: featured.value,
        description: description.value,
        about: about.value,
        discussion_group_url: discussion_group_url.value || null,
        status: status.value,
        allow_waitlist: allow_waitlist.value,
        start_date: start_date.value,
        end_date: end_date.value,
        tags: tags.value,
        thumbnail_url: thumbnail_url.value || null,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )

    isDialogVisible.value = false
    fetchAllCourses() // Refresh course list
  }
  catch (error) {
    if (axios.isAxiosError(error)) {
      errors.value = error.response?.data?.errors || {}
    }
    else {
      console.error('Error updating course:', error)
    }
  }
}

// Get instructor full name
const getInstructorName = (course: Course): string => {
  if (course.instructor) {
    return `${course.instructor.first_name} ${course.instructor.last_name}`
  }
  return $t('admin.unknownInstructor')
}

// Watch for filter changes
watch([searchQuery, statusFilter], () => {
  fetchAllCourses()
}, { debounce: 300 } as any)

// Fetch courses when component loads
onMounted(() => {
  fetchAllCourses()
})
</script>

<template>
  <section>
    <VCard>
      <VCardTitle class="d-flex align-center flex-wrap gap-4 pa-4">
        <h3 class="mt-1">
          {{ $t('admin.allCourses') }}
        </h3>
        <VSpacer />

        <!-- Search -->
        <VTextField
          v-model="searchQuery"
          :placeholder="$t('actions.search')"
          density="compact"
          prepend-inner-icon="ri-search-line"
          style="max-inline-size: 250px;"
          clearable
        />

        <!-- Status Filter -->
        <VSelect
          v-model="statusFilter"
          :items="statusOptions"
          :label="$t('course.status')"
          density="compact"
          style="max-inline-size: 180px;"
          clearable
        />

        <!-- Refresh Button -->
        <VBtn
          icon
          variant="text"
          color="default"
          @click="fetchAllCourses"
        >
          <VIcon icon="ri-refresh-line" />
        </VBtn>
      </VCardTitle>

      <!-- Course List Table -->
      <VDataTableServer
        :items-per-page="10"
        :items="allCourses"
        item-value="id"
        :items-length="totalCourses"
        :loading="isLoading"
        :headers="[
          { title: $t('course.name'), key: 'course_name', sortable: true },
          { title: $t('admin.instructor'), key: 'instructor', sortable: true },
          { title: $t('admin.enrollments'), key: 'enrollments_count', sortable: true, align: 'center' },
          { title: $t('course.status'), key: 'status', sortable: true, align: 'center' },
          { title: $t('course.visibility'), key: 'visibility', sortable: true, align: 'center' },
          { title: $t('actions.actions'), key: 'actions', sortable: false, align: 'center' },
        ]"
        class="text-no-wrap rounded-0"
      >
        <!-- Course Name -->
        <template #item.course_name="{ item }">
          <div class="d-flex align-center gap-3">
            <VAvatar
              v-if="item.thumbnail_url"
              :image="item.thumbnail_url"
              size="38"
              rounded
            />
            <VAvatar
              v-else
              color="primary"
              size="38"
              rounded
            >
              <VIcon icon="ri-book-2-line" />
            </VAvatar>
            <div>
              <p class="font-weight-medium mb-0">
                {{ item.course_name }}
              </p>
              <span class="text-sm text-disabled">{{ item.course_code }}</span>
            </div>
          </div>
        </template>

        <!-- Instructor -->
        <template #item.instructor="{ item }">
          <div class="d-flex align-center gap-2">
            <VIcon
              icon="ri-user-line"
              size="18"
              color="primary"
            />
            <span>{{ getInstructorName(item) }}</span>
          </div>
        </template>

        <!-- Enrollments Count -->
        <template #item.enrollments_count="{ item }">
          <VChip
            color="info"
            size="small"
          >
            {{ item.enrollments_count || 0 }} {{ $t('admin.students') }}
          </VChip>
        </template>

        <!-- Status -->
        <template #item.status="{ item }">
          <VChip
            :color="item.status === 'active' ? 'success' : item.status === 'draft' ? 'warning' : 'secondary'"
            size="small"
            class="text-capitalize"
          >
            {{ $t(`course.${item.status}`) }}
          </VChip>
        </template>

        <!-- Visibility -->
        <template #item.visibility="{ item }">
          <VChip
            :color="item.visibility ? 'success' : 'secondary'"
            size="small"
          >
            {{ item.visibility ? $t('course.public') : $t('course.private') }}
          </VChip>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <VBtn
            variant="tonal"
            color="info"
            size="small"
            @click="openEditDialog(item.id)"
          >
            <VIcon
              start
              icon="ri-pencil-line"
              size="16"
            />
            {{ $t('actions.edit') }}
          </VBtn>
        </template>

        <!-- Bottom pagination -->
        <template #bottom />
      </VDataTableServer>
    </VCard>

    <!-- Course Edit Dialog -->
    <VDialog
      v-model="isDialogVisible"
      max-width="800"
    >
      <VCard :title="$t('course.titleEdit')">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="isDialogVisible = false"
        />

        <VCardText>
          <VRow>
            <!-- Course Name -->
            <VCol cols="12">
              <VTextField
                v-model="course_name"
                :label="$t('course.name')"
                outlined
                disabled
              />
            </VCol>

            <!-- Visibility -->
            <VCol
              cols="12"
              sm="6"
            >
              <VSelect
                v-model="visibility"
                :label="$t('course.visibility')"
                :items="[
                  { title: $t('course.visibilityPublic'), value: 'true' },
                  { title: $t('course.visibilityHidden'), value: 'false' },
                ]"
                outlined
              />
            </VCol>

            <!-- Status -->
            <VCol
              cols="12"
              sm="6"
            >
              <VSelect
                v-model="status"
                :label="$t('course.status')"
                :items="[
                  { title: $t('course.active'), value: 'active' },
                  { title: $t('course.draft'), value: 'draft' },
                  { title: $t('course.archived'), value: 'archived' },
                ]"
                outlined
              />
            </VCol>

            <!-- Description -->
            <VCol cols="12">
              <VTextarea
                v-model="description"
                :label="$t('course.description')"
                outlined
                rows="4"
              />
            </VCol>

            <!-- About -->
            <VCol cols="12">
              <VTextarea
                v-model="about"
                :label="$t('course.about')"
                outlined
                rows="4"
              />
            </VCol>

            <!-- Discussion Group URL -->
            <VCol cols="12">
              <VTextField
                v-model="discussion_group_url"
                :label="$t('course.discussionGroupUrl')"
                outlined
              />
            </VCol>
          </VRow>
        </VCardText>

        <!-- Dialog Footer -->
        <VCardActions class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            color="secondary"
            @click="isDialogVisible = false"
          >
            {{ $t('button.close') }}
          </VBtn>
          <VBtn
            color="primary"
            @click="updateCourse"
          >
            {{ $t('button.save') }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </section>
</template>
