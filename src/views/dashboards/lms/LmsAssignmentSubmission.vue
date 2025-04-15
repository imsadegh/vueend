<script setup lang="ts">
import { API_BASE_URL } from '@/config/config';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

// Assume the route includes an assignmentId parameter
const props = defineProps<{ assignmentId: number | string }>()
const assignmentId = ref(props.assignmentId)
const assignment = ref<any>(null)

const { t: $t } = useI18n()
const token = useCookie('accessToken').value


// Submission form state
const submissionFile = ref<File | null>(null)
const comments = ref('')
const errors = ref<Record<string, string>>({})
const submission = ref<any>(null)

// Fetch assignment details (to display title, description, etc.)
const fetchAssignmentDetails = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/assignments/${assignmentId.value}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    assignment.value = response.data
    // assignment.value = response.data.assignment
    // submission.value = response.data.submission
  } catch (error) {
    console.error('Error fetching assignment details:', (error as any).response?.data || (error as any).message)
  }
}

// Submit assignment (saves to assignment_submissions table)
const submitAssignment = async () => {
  errors.value = {}
  try {
    const formData = new FormData()
    formData.append('assignment_id', assignmentId.value as string)
    if (submissionFile.value) {
      formData.append('file', submissionFile.value)
    }
    formData.append('comments', comments.value)

    const response = await axios.post(
      `${API_BASE_URL}/assignments/${assignmentId.value}/submissions`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    console.log('Submission successful:', response.data)
    // Optionally, clear form or show a success message
  } catch (error: any) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      console.error('Submission error:', error.message)
    }
  }
}

onMounted(() => {
  fetchAssignmentDetails()
})
</script>

<template>
  <VCard>
    <VCardTitle>{{ $t('assignment.submitAssignment') }}</VCardTitle>
    <VCardText>
      <div v-if="assignment">
        <p><strong>{{ $t('assignment.title') }}:</strong> {{ assignment.title }}</p>
        <p><strong>{{ $t('assignment.description') }}:</strong> {{ assignment.description }}</p>
      </div>
      <div v-if="assignment && !assignment.is_active" class="text-error">
        {{ $t('assignment.notActive') }}
      </div>

       <!-- 📌 Show feedback if reviewed -->
      <!-- <div v-if="assignment?.feedback" class="mt-4">
        <p><strong>{{ $t('assignment.instructorFeedback') }}:</strong> {{ assignment.feedback }}</p>
      </div> -->

      <!-- <VForm @submit.prevent="submitAssignment"> -->
      <VForm v-if="assignment && assignment.is_active" @submit.prevent="submitAssignment">
      <!-- <VForm v-if="assignment && assignment.is_active && !submission?.feedback" @submit.prevent="submitAssignment"> -->

        <div v-if="submission?.feedback" class="mt-4 text-success">
          <p><strong>{{ $t('assignment.instructorFeedback') }}:</strong> {{ submission.feedback }}</p>
          <p><strong>{{ $t('assignment.score') }}:</strong> {{ submission.score ?? '-' }}</p>
        </div>

        <!-- <VTextarea :label="$t('assignment.comments')" outlined /> -->
        <VTextarea v-model="comments" :label="$t('assignment.comments')" outlined />
        <div v-if="errors.comments" class="text-error">{{ errors.comments }}</div>
        <VBtn type="submit" color="primary">{{ $t('button.submit') }}</VBtn>
      </VForm>
    </VCardText>
  </VCard>
</template>
