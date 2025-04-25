<script setup lang="ts">
import { API_BASE_URL } from '@/config/config'
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const token = useCookie('accessToken').value
const route = useRoute()
const router = useRouter()
const emit = defineEmits(['close'])

// const examId     = Number(route.params.examId)
/* ▸ 1. allow examId as a prop or take it from route */
const props = defineProps<{ examId?: number }>()
const examId = computed(() => {
  const id = props.examId ?? Number(route.params.examId)
  return Number.isFinite(id) ? id : null
})

const attemptId = ref<number | null>(null)
const question = ref<any | null>(null)
const answer = ref<string>('')

/* ── helpers ───────────────────────────────────────────── */
const loadNext = async () => {
  if (!attemptId.value) return
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/exams/${examId.value}/attempts/${attemptId.value}/next`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    question.value = data.question
    answer.value = ''
  } catch (e: any) {
    if (e.response?.status === 403) {
      // attempt is finished ➜ mark UI as completed
      question.value = null
      alert('🎉 آزمون شما به پایان رسید و ثبت شد')
    } else {
      console.error(e)
    }
  }
}

const startAttempt = async () => {
  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/exams/${examId.value}/attempts`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    )
    attemptId.value = data.attempt.id
    question.value = data.question
  } catch (e: any) {
    console.error(e.response?.data ?? e)
    alert(e.response?.data?.message || 'خطا در شروع آزمون')
  }
}

const submitAnswer = async () => {
  await axios.post(
    `${API_BASE_URL}/attempts/${attemptId.value}/answers`,
    {
      question_id: question.value.id,
      answer_text: question.value.type === 'multiple_choice' ? null : answer.value,
      selected_option: question.value.type === 'multiple_choice' ? answer.value : null,
    },
    { headers: { Authorization: `Bearer ${token}` } },
  )

  await loadNext()
  // if (!question.value) {
  // router.replace({ name: 'exam-finished', params: { examId: examId.value } })
  // alert('🎉 آزمون شما با موفقیت ثبت شد')
  // }
}

// onMounted(startAttempt)
/* ▸ 2. ensure we have an examId, otherwise show nothing */
onMounted(() => {
  if (examId.value) startAttempt()
  else console.warn('ExamAttempt.vue: missing examId')
})
</script>

<template>
  <VCard v-if="question">
    <VCardTitle>{{ question.title || ('Q' + question.id) }}</VCardTitle>

    <VCardText>
      <p>{{ question.question_text }}</p>

      <VRadioGroup v-if="question.type === 'multiple_choice'" v-model="answer">
        <VRadio v-for="opt in question.options" :key="opt" :label="opt" :value="opt" />
      </VRadioGroup>

      <VTextarea v-else v-model="answer" :label="$t('exam.yourAnswer')" rows="4" />
    </VCardText>

    <VCardActions class="justify-end">
      <VBtn color="primary" :disabled="!answer" @click="submitAnswer">
        {{ $t('button.next') }}
      </VBtn>
    </VCardActions>
  </VCard>

  <!-- <VAlert v-else type="success" color="success" class="d-flex justify-space-between align-center">
    <span>{{ $t('exam.finished') }}</span>
    <VBtn variant="text" @click="emit('close')">
      {{ $t('button.close') }}
    </VBtn>
  </VAlert> -->

  <VAlert v-else type="info" style=" text-align: center;" :title="$t('exam.finished')">
    <VBtn variant="tonal" @click="emit('close')">
      {{ $t('button.close') }}
      <VIcon end icon="ri-close-large-fill" />
    </VBtn>
  </VAlert>
</template>
