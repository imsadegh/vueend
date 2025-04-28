<script setup lang="ts">
import { API_BASE_URL } from '@/config/config'
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'

const token = useCookie('accessToken').value

/* ───────── state ───────── */
const attempts = ref<any[]>([])
const total = ref(0)

const dialog = ref(false)
const attemptDetail = ref<any | null>(null)
const finalGrade = ref<number | null>(null)
const feedback = ref<string>('')

/* new state */
const answers = ref<any[]>([])
const isPassed = ref(false)
const isFinalized = ref(true)
// const isReexam = ref(false)
const scoreDetails = ref<{ question_id: number; earned: number }[]>([])

/* ╭─ suggested grade (0–100) ─╮ */
const suggestedGrade = computed(() => {
  if (!scoreDetails.value.length) return null
  const earned = scoreDetails.value.reduce((s, r) => s + Number(r.earned || 0), 0)
  return Number(((earned / scoreDetails.value.length) * 1).toFixed(2))
})

/* ───────── fetch list ───────── */
const fetchAttempts = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/exam-attempts`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  attempts.value = data
  total.value = data.length
}

/* ───────── open review dialog ───────── */
const openReview = async (row: any) => {
  const { data } = await axios.get(`${API_BASE_URL}/attempts/${row.id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  attemptDetail.value = data
  console.log('attemptDetail', data)
  finalGrade.value = data.exam_score?.final_grade ?? data.exam_score?.score ?? suggestedGrade.value
  feedback.value = data.exam_score?.grading_feedback?.note ?? ''

  isPassed.value = data.exam_score?.is_passed ?? false
  isFinalized.value = data.exam_score?.is_finalized ?? false
  // isReexam.value = data.exam_score?.is_reexam ?? false

  // build editable score rows
  scoreDetails.value =
    data.exam_score?.score_details
    ?? answers.value.map((ans: any) => ({
      question_id: ans.question_id,
      earned: ans.earned ?? 0,
    }))

  dialog.value = true

}

/* ───────── save / update score ───────── */
const saveScore = async () => {
  const body = {
    final_grade: finalGrade.value,
    grading_feedback: { note: feedback.value },
    is_passed: isPassed.value,
    is_finalized: isFinalized.value,
    // is_reexam: isReexam.value,
    // score_details: scoreJson.value ? JSON.parse(scoreJson.value) : null,
    score_details: scoreDetails.value,
  }
  if (attemptDetail.value.exam_score?.id) {
    // update existing
    await axios.put(`${API_BASE_URL}/exam-scores/${attemptDetail.value.exam_score.id}`, {
      // final_grade: finalGrade.value,
      // grading_feedback: { note: feedback.value },
      // is_finalized: true,
      ...body,
    }, { headers: { Authorization: `Bearer ${token}` } })
  } else {
    // first-time review
    await axios.post(`${API_BASE_URL}/exam-scores`, {
      attempt_id: attemptDetail.value.id,
      ...body,
    }, { headers: { Authorization: `Bearer ${token}` } })
  }
  dialog.value = false
  fetchAttempts()
}

onMounted(fetchAttempts)

// utils
import { formatDateFa } from '@/utils/dateFa'
</script>

<template>
  <section>
    <VCard>
      <VCardTitle class="mt-1">
        <h4>{{ $t('exam.attempts') }}</h4>
      </VCardTitle>

      <VDataTableServer :items="attempts" :items-length="total" :headers="[
        { title: $t('student'), key: 'user.full_name' },
        { title: $t('course.name'), key: 'exam.course.course_name' },
        { title: $t('exam.title'), key: 'exam.name' },
        { title: $t('academy.openTime'), key: 'started_at', align: 'center' },
        // { title: $t('exam.duration'), key: 'duration', align: 'center' },
        // { title: $t('exam.score'), key: 'score', align: 'center' },
        { title: $t('exam.reviewScore'), key: 'reviewScore', align: 'center' },

        // { title: $t('exam.attempt'), key: 'attempt_number', align: 'center' },
        { title: $t('status'), key: 'is_submitted', align: 'center' },
        { title: $t('actions.actions'), key: 'review', sortable: false, align: 'center' },
      ]" class="text-no-wrap">

        <template #item.started_at="{ item }">
          {{ formatDateFa(item.started_at) }}
        </template>

        <template #item.reviewScore="{ item }">
          {{
            item.exam_score?.final_grade
            ?? item.exam_score?.score
            ?? '—'
          }}
        </template>

        <template #item.is_submitted="{ item }">
          <VChip :color="item.finished_at ? 'success' : 'warning'" size="small">
            {{ item.finished_at ? $t('exam.isfinished') : $t('exam.inProgress') }}
          </VChip>
        </template>

        <template #item.review="{ item }">
          <VBtn v-if="!item.exam_score?.is_reexam" class="ma-1" variant="tonal" :disabled="!item.finished_at"
            @click="openReview(item)">
            {{ $t('actions.review') }}
            <VIcon end icon="ri-pencil-line" />
          </VBtn>
          <span v-else class="text-warning">
            {{ $t('exam.waitingForNewExam') }}
          </span>

        </template>
      </VDataTableServer>
    </VCard>

    <VDialog v-model="dialog" max-width="900" persistent>
      <VCard>
        <VCardTitle>
          {{ attemptDetail?.exam?.name }} — {{ attemptDetail?.user?.full_name }}
        </VCardTitle>

        <VCardText>
          <VList dense>
            <!-- <VListItem v-for="ans in answers" :key="ans.id" class="mb-3"> -->
            <VListItem v-for="ans in attemptDetail?.answers ?? []" :key="ans.id" class="mb-3">
              <VListItemSubtitle>
                <strong>سوال {{ ans.question_id }}:</strong> {{ ans.question.question_text }}
              </VListItemSubtitle>
              <VListItemTitle class="mt-1">
                <strong>{{ $t('studentAnswer') }}:</strong>
                {{ ans.selected_option ?? ans.answer_text }}
              </VListItemTitle>
            </VListItem>
          </VList>

          <VDivider class="my-4" />

          <VRow>
            <span class="mx-2">{{ $t('exam.scoreFrom') }} ۲۰ {{ $t('exam.perAnswer') }}</span>
            <VSpacer class="my-2" />
            <VCol cols="12">
              <VRow dense>
                <VCol v-for="row in scoreDetails" :key="row.question_id" cols="6" sm="4" md="3"
                  class="d-flex align-center gap-2 mb-2">
                  <span class="text-caption font-weight-medium">
                    Q{{ row.question_id }}:
                  </span>
                  <VTextField v-model.number="row.earned" type="number" :max="20" hide-details density="compact"
                    style="max-inline-size: 4.5rem;" />
                </VCol>
              </VRow>
            </VCol>

            <VDivider class="my-4" />

            <VCol cols="12" sm="4">
              <VTextField v-model="finalGrade" type="number" :label="$t('exam.finalGrade')" :max="20" :min="0" />
              <!-- Suggested badge -->
              <VChip v-if="suggestedGrade !== null" color="info" size="small" class="mt-2 cursor-pointer"
                @click="finalGrade = suggestedGrade">
                {{ $t('exam.suggested') }}: {{ suggestedGrade }}
              </VChip>
            </VCol>

            <VCol cols="12" sm="4">
              <VCheckbox v-model="isPassed" :label="$t('exam.passed')" />
              <VCheckbox v-model="isFinalized" :label="$t('exam.finalized')" />
              <!-- <VCheckbox v-model="isReexam" :label="$t('exam.reexam')" /> -->
            </VCol>

            <VCol cols="12" sm="8">
              <VTextarea v-model="feedback" :label="$t('exam.feedback')" rows="3" />
            </VCol>



          </VRow>
        </VCardText>

        <VCardActions class="justify-end">
          <VBtn color="secondary" @click="dialog = false">{{ $t('button.cancel') }}</VBtn>
          <VBtn color="primary" @click="saveScore">{{ $t('button.save') }}</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </section>
</template>
