<script setup lang="ts">
import { API_BASE_URL } from '@/config/config'
import axios from 'axios'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const route = useRoute()
const { t: $t } = useI18n()
const token = useCookie('accessToken').value

// We'll assume we get the courseId from the route or props
// E.g. /instructor/courses/:courseId/assignments
const courseId = Number(route.params.courseId ?? 7)

// Data
const assignments = ref<any[]>([])
const isDialogVisible = ref(false)
const isEditMode = ref(false)

const instructorCourses = ref<any[]>([]);
const selectedCourseId = ref<number | null>(null);


// Assignment form
const form = ref({
  id: null,
  title: '',
  description: '',
  submission_deadline: '' as string | null,
  max_score: 100,
  visible: false,
  type: 'individual',
})

// Errors
const errors = ref<Record<string, string[] | undefined>>({})

// Table headers
const headers = [
  { title: $t('assignment.title'), key: 'title', sortable: false },
  { title: $t('assignment.courseName'), key: 'course_name', sortable: false, align: 'center' as const },
  { title: $t('assignment.type'), key: 'type', sortable: false, align: 'center' as const },
  { title: $t('assignment.visible'), key: 'visible', sortable: false, align: 'center' as const },
  { title: $t('actions.actions'), key: 'actions', sortable: false, align: 'center' as const },
]

// Fetch assignments for all courses the instructor is teaching
const fetchAssignments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/instructor/assignments`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    assignments.value = response.data.map((assignment: any) => {
      // Include course name with assignment data
      return {
        ...assignment,
        course_name: assignment.course_name, // Assuming course_name is in the API response
      }
    })
  } catch (error) {
    console.error('Error fetching assignments:', (error as any).response?.data || (error as any).message)
  }
}

 const fetchInstructorCourses = async () => {
   try {
     const response = await axios.get(`${API_BASE_URL}/instructor/courses`, {
       headers: { Authorization: `Bearer ${token}` },
     });
     instructorCourses.value = response.data;
   } catch (error) {
     console.error('Error fetching instructor courses:', (error as any).response?.data || (error as any).message);
   }
 };

 

// Open dialog to create a new assignment
const openCreateDialog = () => {
  resetForm()
  isDialogVisible.value = true
  isEditMode.value = false
}

// Open dialog to edit an assignment
const openEditDialog = (assignment: any) => {
  isDialogVisible.value = true
  isEditMode.value = true
  resetErrors()

  // Fill form with existing assignment data
  form.value = {
    id: assignment.id,
    title: assignment.title,
    description: assignment.description,
    submission_deadline: assignment.submission_deadline
      ? formatToLocalDatetime(assignment.submission_deadline)
      : null,
    max_score: assignment.max_score,
    visible: assignment.visible,
    type: assignment.type,
  }
}

// Create a new assignment
const createAssignment = async () => {
  resetErrors()
  try {
    if (!selectedCourseId.value) {
      throw new Error("Please select a course for the assignment.");
    }
    await axios.post(
      `${API_BASE_URL}/courses/${selectedCourseId.value}/assignments`,
      {
        title: form.value.title,
        description: form.value.description,
        submission_deadline: form.value.submission_deadline,
        max_score: form.value.max_score,
        visible: form.value.visible,
        type: form.value.type,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
    isDialogVisible.value = false
    fetchAssignments()
  } catch (error) {
    handleAxiosError(error)
  }
}

// Update an existing assignment
const updateAssignment = async () => {
  resetErrors()
  if (!form.value.id) return

  try {
    await axios.put(
      `${API_BASE_URL}/assignments/${form.value.id}`,
      {
        title: form.value.title,
        description: form.value.description,
        submission_deadline: form.value.submission_deadline,
        max_score: form.value.max_score,
        visible: form.value.visible,
        type: form.value.type,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
    isDialogVisible.value = false
    fetchAssignments()
  } catch (error) {
    handleAxiosError(error)
  }
}

// Delete an assignment
const deleteAssignment = async (assignmentId: number) => {
  if (!confirm($t('assignment.confirmDelete'))) {
    return
  }

  try {
    await axios.delete(
      `${API_BASE_URL}/assignments/${assignmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
    fetchAssignments()
  } catch (error) {
    console.error('Error deleting assignment:', (error as any).response?.data || (error as any).message)
  }
}

// Utility: Reset form
const resetForm = () => {
  form.value = {
    id: null,
    title: '',
    description: '',
    submission_deadline: null,
    max_score: 100,
    visible: false,
    type: 'individual',
  }
}

// Utility: Reset errors
const resetErrors = () => {
  errors.value = {}
}

// Utility: Convert backend datetime -> local datetime string
const formatToLocalDatetime = (dateString: string) => {
  const date = new Date(dateString)
  const pad = (num: number) => num.toString().padStart(2, '0')
  // Format: yyyy-MM-ddTHH:mm
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

// Utility: Handle Axios errors
const handleAxiosError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    // If we have validation errors
    const validationErrors = error.response?.data?.errors
    if (validationErrors && typeof validationErrors === 'object') {
      errors.value = validationErrors
    } else {
      console.error('Error:', error.response?.data || error.message)
    }
  } else {
    console.error(error)
  }
}

// On component load, fetch assignments
watch(isDialogVisible, (newValue) => {
  if (newValue) {
    fetchAssignments();
  }
});


// Call fetchInstructorCourses once on component mount
onMounted(() => {
   fetchInstructorCourses();
   fetchAssignments(); // existing function
 });

</script>


<template>
  <section>
    <VCard>
      <VCardTitle>
        <!-- <h3>{{ $t('assignment.myAssignmentsForCourse') }} #{{ courseId }}</h3> -->
        <h3>{{ $t('assignment.myAssignments') }}</h3>
      </VCardTitle>

      <!-- Assignment List Table -->
      <VDataTableServer :items="assignments" :headers="headers" :items-length="assignments.length"
        class="text-no-wrap rounded-0">
        <!-- Title -->
        <template #item.title="{ item }">
          <strong>{{ item.title }}</strong>
        </template>

        <!-- Course Name -->
        <template #item.course_name="{ item }">
          <strong>{{ item.course_name }}</strong>
        </template>

        <!-- Type -->
        <template #item.type="{ item }">
          <VChip :color="item.type === 'group' ? 'success' : 'secondary'" size="small">
            {{ item.type }}
          </VChip>
        </template>

        <!-- Visible -->
        <template #item.visible="{ item }">
          <VChip :color="item.visible ? 'success' : 'secondary'" size="small">
            {{ item.visible ? $t('assignment.visible') : $t('assignment.hidden') }}
          </VChip>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <VBtn color="primary" class="ma-1" @click="openEditDialog(item)">
            {{ $t('actions.edit') }}
          </VBtn>
          <VBtn color="error" class="ma-1" @click="deleteAssignment(item.id)">
            {{ $t('actions.delete') }}
          </VBtn>
        </template>

        <template #body.append>
          <div v-if="assignments.length === 0" class="pa-4 text-center">
            {{ $t('assignment.noAssignmentsFound') }}
          </div>
        </template>
      </VDataTableServer>

      <VCardActions>
        <VBtn color="primary" @click="openCreateDialog">
          {{ $t('assignment.createNew') }}
        </VBtn>
      </VCardActions>
    </VCard>

    <!-- Create/Edit Assignment Dialog -->
    <VDialog v-model="isDialogVisible" max-width="700">
      <VCard>
        <VCardTitle>
          {{ isEditMode ? $t('assignment.editAssignment') : $t('assignment.createAssignment') }}
        </VCardTitle>
        <DialogCloseBtn variant="text" size="default" @click="isDialogVisible = false" />

        <VCardText>
          <VForm @submit.prevent="isEditMode ? updateAssignment() : createAssignment()">
            <VRow>
              <!-- Title -->
              <VCol cols="12" sm="6">
                <VTextField v-model="form.title" :label="$t('assignment.title')" :error-messages="errors.title" outlined
                  required />
              </VCol>

              <!-- Course Selection Dropdown -->
              <VCol cols="12" sm="6">
                <VSelect
                  v-model="selectedCourseId"
                  :items="instructorCourses"
                  item-title="course_name"
                  item-value="id"
                  :label="$t('assignment.selectCourse')"
                  outlined
                  required
                />
              </VCol>

              <!-- Type (individual/group) -->
              <VCol cols="12" sm="6">
                <VSelect v-model="form.type" :label="$t('assignment.type')" :items="[
                  { title: 'Individual', value: 'individual' },
                  { title: 'Group', value: 'group' },
                ]" :error-messages="errors.type" outlined required />
              </VCol>

              <!-- Max Score -->
              <VCol cols="12" sm="6">
                <VTextField v-model="form.max_score" :label="$t('assignment.maxScore')" type="number" step="0.01"
                  min="0" max="100" :error-messages="errors.max_score" outlined required />
              </VCol>

              <!-- Visibility -->
              <VCol cols="12" sm="6">
                <VSwitch v-model="form.visible" :label="$t('assignment.visible')" inset />
              </VCol>

              <!-- Deadline -->
              <VCol cols="12" sm="6">
                <VTextField v-model="form.submission_deadline" :label="$t('assignment.submissionDeadline')"
                  type="datetime-local" :error-messages="errors.submission_deadline" outlined />
              </VCol>

              <!-- Description -->
              <VCol cols="12">
                <VTextarea v-model="form.description" :label="$t('assignment.description')"
                  :error-messages="errors.description" rows="4" outlined />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>

        <VCardActions class="d-flex justify-end flex-wrap gap-4">
          <VBtn color="secondary" @click="isDialogVisible = false">
            {{ $t('button.close') }}
          </VBtn>
          <VBtn color="primary" @click="isEditMode ? updateAssignment() : createAssignment()">
            {{ $t('button.save') }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </section>
</template>


<style scoped>
/* Add your custom styles here */
</style>
