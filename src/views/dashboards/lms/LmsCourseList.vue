<script setup lang="ts">
import { API_BASE_URL } from '@/config/config'
import axios from 'axios'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const token = useCookie('accessToken').value

// Data state
interface Course {
  id: number;
  course_name: string;
  course_code: string;
  status: string;
  visibility: boolean;
  featured: boolean;
  description: string;
  about: string;
  discussion_group_url: string;
  allow_waitlist: boolean;
  start_date: string | null;
  end_date: string | null;
  tags: string[];
  thumbnail_url: string;
}

const instructorCourses = ref<Course[]>([])
// const instructorCourses = ref([])
const totalCourses = ref(0)
const isDialogVisible = ref(false)
const selectedCourseId = ref<number | null>(null)
// const selectedCourseId = ref(null)

// Form state
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

// Fetch courses for instructor
const fetchInstructorCourses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/instructor/courses`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    instructorCourses.value = response.data
    totalCourses.value = response.data.length
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching instructor courses:', error.response?.data || error.message)
    } else {
      console.error('Error fetching instructor courses:', error)
    }
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
  } catch (error) {
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
      }
    )

    console.log('Course updated successfully')
    isDialogVisible.value = false
    fetchInstructorCourses() // Refresh course list

  } catch (error) {
    if (axios.isAxiosError(error)) {
      errors.value = error.response?.data?.errors || {}
    } else {
      console.error('Error updating course:', error)
    }
  }
}

// Fetch courses when component loads
fetchInstructorCourses()
</script>

<template>
  <section>
    <VCard>
      <VCardTitle>
        <h3 class="mt-1">{{ $t('course.myCourses') }}</h3>
      </VCardTitle>

      <!-- Course List Table -->
      <VDataTableServer :items-per-page.sync="10" :items="instructorCourses" item-value="id"
        :items-length="totalCourses" :headers="[
          { title: $t('course.name'), key: 'course_name', sortable: true },
          { title: $t('course.discussionGroupUrl'), key: 'course_discussionGroup', sortable: true, align: 'center' },
          { title: $t('course.status'), key: 'status', sortable: true, align: 'center' },
          { title: $t('course.visibility'), key: 'visibility', sortable: true, align: 'center' },
          { title: $t('actions.edit'), key: 'edit', sortable: false, align: 'center' },
        ]" class="text-no-wrap rounded-0">

        <!-- Course Name -->
        <template #item.course_name="{ item }">
          {{ item.course_name }}
        </template>

        <!-- Discussion Group Link (Clickable) -->
        <template #item.course_discussionGroup="{ item }">
          <a :href="item.discussion_group_url" target="_blank" class="text-primary">
            {{ item.discussion_group_url.replace(/^(https?:\/\/)?(www\.)?/, '').length > 30 
              ? item.discussion_group_url.replace(/^(https?:\/\/)?(www\.)?/, '').substring(0, 10) + '...' 
              : item.discussion_group_url.replace(/^(https?:\/\/)?(www\.)?/, '') }}
          </a>
        </template>

        <!-- Status -->
        <template #item.status="{ item }">
          <VChip :color="item.status === 'active' ? 'success' : item.status === 'draft' ? 'warning' : 'secondary'"
            size="small" class="text-capitalize">
            {{ $t(`course.${item.status}`) }}
          </VChip>
        </template>

        <!-- Visibility -->
        <template #item.visibility="{ item }">
          <VChip :color="item.visibility ? 'success' : 'secondary'" size="small">
            {{ item.visibility ? $t('course.public') : $t('course.private') }}
          </VChip>
        </template>

        <!-- Edit Button -->
        <template #item.edit="{ item }">
          <VBtn class="ma-1" variant="tonal" color="info" @click="openEditDialog(item.id)">
            {{ $t('actions.edit') }}
            <VIcon end icon="ri-pencil-line" />
          </VBtn>
        </template>

        <!-- Bottom -->
        <template #bottom />
      </VDataTableServer>
    </VCard>

    <!-- Course Edit Dialog -->
    <VDialog v-model="isDialogVisible" max-width="800">
      <VCard :title="$t('course.titleEdit')">
        <DialogCloseBtn variant="text" size="default" @click="isDialogVisible = false" />

        <VCardText>
          <VRow>
            <!-- Course Name -->
            <VCol cols="12">
              <VTextField v-model="course_name" :label="$t('course.name')" outlined disabled />
            </VCol>

              <!-- Visibility -->
              <VCol cols="12" sm="6">
                <VSelect v-model="visibility" :label="$t('course.visibility')" :items="[
                { title: $t('course.visibilityPublic'), value: 'true' },
                { title: $t('course.visibilityHidden'), value: 'false' }
              ]" outlined />
              </VCol>

              <!-- Status -->
              <VCol cols="12" sm="6">
                <VSelect v-model="status" :label="$t('course.status')" :items="[
                  { title: $t('course.active'), value: 'active' },
                  { title: $t('course.draft'), value: 'draft' },
                  { title: $t('course.archived'), value: 'archived' }
                ]" outlined />
              </VCol>

              <!-- Description -->
              <VCol cols="12">
                <VTextarea v-model="description" :label="$t('course.description')" outlined rows="4" />
              </VCol>

              <!-- About -->
              <VCol cols="12">
                <VTextarea v-model="about" :label="$t('course.about')" outlined rows="4" />
              </VCol>

              <!-- Discussion Group URL -->
              <VCol cols="12">
                <VTextField v-model="discussion_group_url" :label="$t('course.discussionGroupUrl')" outlined />
              </VCol>

              <!-- Start Date & End Date -->
              <!-- <VCol cols="12" sm="6">
                <VDatePicker v-model="start_date" title="" :header="$t('course.startDate')" />
              </VCol>
              <VCol cols="12" sm="6">
                <VDatePicker v-model="end_date" title="" :header="$t('course.endDate')" />
              </VCol> -->
          </VRow>
        </VCardText>

        <!-- Dialog Footer -->
        <VCardActions class="d-flex justify-end flex-wrap gap-4">
          <VBtn color="secondary" @click="isDialogVisible = false">
            {{ $t('button.close') }}
          </VBtn>
          <VBtn color="primary" @click="updateCourse">
            {{ $t('button.save') }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </section>
</template>
