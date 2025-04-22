<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
// import { useCookie } from '#imports'
import { API_BASE_URL } from '@/config/config'

const { t: $t } = useI18n()
const token = useCookie('accessToken').value
const userData = useCookie<any>('userData')

const reviewScore = ref<number | null>(null)
const reviewFeedback = ref('')
const reviewGradeVisibility = ref(true)
const reviewComments = ref('')
const reviewRevisionNumber = ref(1)
const reviewReviewedBy = ref('')         // for display (full name)
const reviewReviewedById = ref<number | null>(null) // for submission (user ID)
const reviewLastReviewedAt = ref('')
const reviewStudentName = ref('')


// Reactive variable to store submissions
const submissions = ref<any[]>([])
interface assignment {
  student_name: string
  assignment_title: string
  submission_date: string
  // comments: string
  // file_path: string
  // score: number
  // feedback: string
  // revision_number: number
  // is_late: boolean
  // last_reviewed_at: string
  // reviewed_by: string
  // grade_visibility: string
  // Add other fields as necessary
}

// Function to fetch assignment submissions for instructor's courses
const fetchSubmissions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/instructor/assignment-submissions`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    submissions.value = response.data
  } catch (error) {
    console.error("Error fetching assignment submissions:", (error as any).response?.data || (error as any).message)
  }
}

const isReviewDialogVisible = ref(false)
const selectedSubmission = ref<any>(null)

function openReviewDialog(submission: any) {
  selectedSubmission.value = submission
  // Optionally initialize your review fields from the submission if needed:
  reviewStudentName.value = submission.student_name || ''
  reviewScore.value = submission.score || null
  reviewFeedback.value = submission.feedback || ''
  reviewGradeVisibility.value = submission.grade_visibility ?? true
  reviewComments.value = submission.comments || ''
  reviewRevisionNumber.value = submission.revision_number || 1
  reviewReviewedBy.value = submission.reviewed_by ?? null
  reviewReviewedById.value = userData.value?.id || null

  reviewLastReviewedAt.value = submission.last_reviewed_at || ''
  isReviewDialogVisible.value = true
}

async function submitReview() {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/instructor/assignment-submissions/${selectedSubmission.value.id}/review`,
      {
        score: reviewScore.value,
        feedback: reviewFeedback.value,
        grade_visibility: reviewGradeVisibility.value,
        reviewed_by: reviewReviewedById.value
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    console.log("Submission reviewed successfully", response.data)
    isReviewDialogVisible.value = false
    fetchSubmissions();
    // Optionally, refresh your submission list here.
  } catch (error: any) {
    console.error("Error reviewing submission:", error.response?.data || error.message)
  }
}

onMounted(() => {
  fetchSubmissions()
})
</script>

<template>
  <VCard>
    <VCardTitle class="mt-1">
      <h4>{{ $t('assignment.reviewSubmissions') }}</h4>
    </VCardTitle>
    <VDataTable :items="submissions" :headers="[
      { title: $t('assignment.studentName'), value: 'student_name' },
      { title: $t('assignment.assignmentTitle'), value: 'assignment_title' },
      { title: $t('assignment.submissionDate'), value: 'submission_date' },
      // { title: $t('assignment.file'), value: 'file_path' },
      { title: $t('assignment.score'), value: 'score' },
      { title: $t('assignment.feedback'), value: 'feedback' },
      // { title: $t('assignment.comments'), value: 'comments' },
      // { title: $t('assignment.revisionNumber'), value: 'revision_number' },
      { title: $t('assignment.isLate'), value: 'is_late' },
      // { title: $t('assignment.lastReviewedAt'), value: 'last_reviewed_at' },
      { title: $t('assignment.reviewedBy'), value: 'reviewed_by' },
      // { title: $t('assignment.gradeVisibility'), value: 'grade_visibility' }
      { title: $t('actions.actions'), value: 'actions' },
    ]" class="elevation-1">
      <!-- <template v-slot:item.file_path="{ item }">
          <a :href="item.file_path" target="_blank">{{ $t('assignment.viewFile') }}</a>
        </template> -->
      <template v-slot:item.actions="{ item }">
        <VBtn class="ma-1" variant="tonal" color="info" @click="openReviewDialog(item)">
            {{ $t('assignment.review') }}
            <VIcon end icon="ri-edit-2-line" />
          </VBtn>

      </template>
    </VDataTable>

  </VCard>
  <VDialog v-model="isReviewDialogVisible" max-width="600">
    <VCard>
      <VCardTitle>{{ $t('assignment.reviewSubmission') }}</VCardTitle>
      <VCardText>
        <VForm @submit.prevent="submitReview">
          <VTextField v-model="reviewStudentName" :label="$t('assignment.studentName')" outlined readonly
            class="mb-4" />

          <VTextField :label="$t('assignment.comments')" v-model="reviewComments" outlined readonly class="mb-4" />

          <VTextField :label="$t('assignment.revisionNumber')" v-model="reviewRevisionNumber" outlined readonly
            class="mb-4" />

          <VTextField :label="$t('assignment.reviewedBy')" v-model="reviewReviewedBy" outlined readonly class="mb-4" />

          <VTextField :label="$t('assignment.lastReviewedAt')" v-model="reviewLastReviewedAt" outlined readonly
            class="mb-4" />

          <VTextField v-model="reviewScore" :label="$t('assignment.score')" type="number" outlined required
            class="mb-4" />

          <VTextarea v-model="reviewFeedback" :label="$t('assignment.feedback')" outlined class="mb-4" />

          <VSwitch v-model="reviewGradeVisibility" :label="$t('assignment.gradeVisibility')" />
          <VCardActions>
            <VBtn type="submit" color="primary">{{ $t('button.save') }}</VBtn>
            <VBtn variant="text" color="secondary" @click="isReviewDialogVisible = false">{{ $t('button.cancel') }}
            </VBtn>
          </VCardActions>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
