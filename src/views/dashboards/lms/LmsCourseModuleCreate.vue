<script setup lang="ts">
import { API_BASE_URL } from '@/config/config'
import axios from 'axios'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
// import { useCookie } from '#imports'

const { t: $t } = useI18n()

const isModuleDialogVisible = ref(false)
// Reactive state for courses dropdown
const courses = ref<Array<{ id: number; course_name: string }>>([])
const props = defineProps<{ courseId: number }>();
const selectedCourseId = ref(props.courseId);
// const selectedCourseId = ref<number | null>(null)

// Form fields for the module
const title = ref('')
const type = ref('article')
const content_url = ref('')
const position = ref<number | null>(null)
const visible = ref(true)
const release_date = ref('')   // Use the proper format (e.g. "YYYY-MM-DDTHH:mm") with datetime-local input
const is_mandatory = ref(false)
const estimated_duration_minutes = ref<number | null>(null)
const slug = ref('')

// Module types for the dropdown, localized
const moduleTypes = ref([
  { title: $t('course.video'), value: 'video' },
  { title: $t('course.article'), value: 'article' },
  { title: $t('course.quiz'), value: 'quiz' },
  { title: $t('course.assignment'), value: 'assignment' },
])

// Get token and user data (created_by is the id of the user creating the module)
const token = useCookie('accessToken').value
const userData = useCookie<any>('userData')
const created_by = userData.value?.id

// Fetch all courses for the dropdown
const fetchCourses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/courses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    courses.value = response.data
  } catch (error) {
    console.error('Error fetching courses:', (error as any).response?.data || (error as any).message)
  }
}

// onMounted(() => {
//   fetchCourses()
//   console.log('Module dialog opened')
// })

// Function to create a module for the selected course
const createModule = async () => {
  if (!selectedCourseId.value) {
    alert($t('course.selectCourse'));
    console.error('No course ID available. Create the course first.');
    return;
  }

  try {
    const payload = {
      title: title.value,
      type: type.value,
      content_url: content_url.value,
      position: position.value,
      visible: visible.value,
      release_date: release_date.value,
      is_mandatory: is_mandatory.value,
      estimated_duration_minutes: estimated_duration_minutes.value,
      slug: slug.value,
      created_by: created_by,
    }
    const response = await axios.post(
      `${API_BASE_URL}/courses/${selectedCourseId.value}/modules`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    console.log('Module created successfully:', response.data)
    // Optionally, reset form fields after a successful create
    title.value = ''
    type.value = 'article'
    content_url.value = ''
    position.value = null
    visible.value = true
    release_date.value = ''
    is_mandatory.value = false
    estimated_duration_minutes.value = null
    slug.value = ''
  } catch (error) {
    console.error('Error creating module:', (error as any).response?.data || (error as any).message)
  }
}

watch(isModuleDialogVisible, (visible) => {
   if (visible) {
     fetchCourses()
       console.log('Module dialog opened')
   }
 })
</script>

<template>
  <VDialog v-model="isModuleDialogVisible" max-width="500">
    <VCard class="pa-4">
      <VCardTitle>{{ $t('course.createModule') }}</VCardTitle>
      <VCardText>
        <VForm @submit.prevent="createModule">
          <!-- Dropdown: Select a Course -->
          <VSelect
            v-model="selectedCourseId"
            :items="courses"
            item-title="course_name"
            item-value="id"
            :label="$t('course.selectCourse')"
            outlined
            required
            class="mb-3"
          />
          <!-- Module Title -->
          <VTextField
            v-model="title"
            :label="$t('course.moduleTitle')"
            outlined
            required
            class="mb-3"
          />
          <!-- Module Type -->
          <VSelect
            v-model="type"
            :items="moduleTypes"
            :label="$t('course.moduleType')"
            outlined
            required
            class="mb-3"
          />
          <!-- Content URL -->
          <VTextField
            v-model="content_url"
            :label="$t('course.moduleContentUrl')"
            outlined
            class="mb-3"
          />
          <!-- Position -->
          <VTextField
            v-model="position"
            type="number"
            :label="$t('course.modulePosition')"
            outlined
            class="mb-3"
          />
          <!-- Visible -->
          <VCheckbox
            v-model="visible"
            :label="$t('course.moduleVisible')"
            class="mb-3"
          />
          <!-- Release Date -->
          <VTextField
            v-model="release_date"
            type="datetime-local"
            :label="$t('course.moduleReleaseDate')"
            outlined
            class="mb-3"
          />
          <!-- Is Mandatory -->
          <VCheckbox
            v-model="is_mandatory"
            :label="$t('course.moduleMandatory')"
            class="mb-3"
          />
          <!-- Estimated Duration (minutes) -->
          <VTextField
            v-model="estimated_duration_minutes"
            type="number"
            :label="$t('course.moduleDuration')"
            outlined
            class="mb-3"
          />
          <!-- Slug -->
          <VTextField
            v-model="slug"
            :label="$t('course.moduleSlug')"
            outlined
            class="mb-3"
          />
          <VCardActions>
            <VBtn type="submit" color="primary">{{ $t('button.save') }}</VBtn>
          </VCardActions>
        </VForm>
      </VCardText>
    </VCard>


</VDialog>

<!-- Activator button -->
 <VBtn color="primary" @click="isModuleDialogVisible = true">
   {{ $t('course.createModule') }}
 </VBtn>
</template>

<style scoped>
/* Add any custom styles as needed */
</style>
