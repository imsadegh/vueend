<script setup lang="ts">
import { API_BASE_URL } from '@/config/config'
import axios from 'axios'
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const token = useCookie('accessToken').value

// State
const exams = ref<any[]>([])
const courses = ref<{ title: string; value: number }[]>([])
const headers = [
  { title: 'نام امتحان', value: 'name' },
  { title: 'دوره', value: 'course_name' },
  { title: 'زمان شروع', value: 'time_open' },
  { title: 'مدت آزمون', value: 'time_limit' },
  { title: 'وضعیت', value: 'status' },
  { title: 'انتشار', value: 'is_published' },
  { title: 'عملیات', value: 'actions', align: 'center' as const, sortable: false },
]

// dialog controls
const isDialogVisible = ref(false)
const isShowDialogVisible = ref(false)
const isEditMode = ref(false)
const selectedExam = ref<any>(null)

// form
const form = reactive<any>({
  course_id: null,
  name: '',
  intro: '',
  time_open: '',
  time_close: '',
  time_limit: 0,
  grade: 20,
  questions_count: 0,
  exam_type: 'multiple_choice',
  shuffle_questions: true,
  shuffle_answers: true,
  attempts: 1,
  feedback_enabled: true,
  version: 1,
  status: 'inactive',
  is_published: false,
})
const errors = reactive<Record<string, string>>({})

// helpers
const examTypes = [
  { value: 'multiple_choice', title: t('examTypes.multipleChoice') },
  { value: 'short_answer', title: t('examTypes.shortAnswer') },
  { value: 'true_false', title: t('examTypes.trueFalse') },
  { value: 'essay', title: t('examTypes.essay') },
]
const examStatus = [
  { value: 'active', title: t('examStatus.active') },
  { value: 'inactive', title: t('examStatus.inactive') },
  { value: 'draft', title: t('examStatus.draft') },
]

// above your existing saveCourse / updateCourse…
const handleSave = () => {
  const text = isEditMode.value
    ? t('exam.confirmEdit')    // “Are you sure you want to edit this exam?”
    : t('exam.confirmCreate')  // “Are you sure you want to create this exam?”
  if (confirm(text)) {
    // isEditMode.value ? updateCourse() : saveCourse()
    saveExam()
  }
}

// fetch all
async function fetchExams() {
  const res = await axios.get(`${API_BASE_URL}/exams`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  exams.value = res.data
}
async function fetchCourses() {
  const res = await axios.get(`${API_BASE_URL}/courses`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  courses.value = res.data.map((c: any) => ({ title: c.course_name, value: c.id }))
}

onMounted(() => {
  fetchExams()
  fetchCourses()
})

// open dialogs
const openCreate = async () => {
  await fetchCourses()
  isEditMode.value = false
  Object.assign(form, {
    course_id: null, name: '', intro: '', time_open: '', time_close: '',
    time_limit: 0, grade: 20, questions_count: 0, exam_type: 'essay',
    shuffle_questions: true, shuffle_answers: true, attempts: 1,
    feedback_enabled: true, version: 1, status: 'active', is_published: false,
  })
  Object.keys(errors).forEach(k => errors[k] = '')
  isDialogVisible.value = true
}

const openEdit = async (e: any) => {
  await fetchCourses()
  isEditMode.value = true
  selectedExam.value = e
  Object.assign(form, { ...e, time_open: e.time_open?.slice(0, 16), time_close: e.time_close?.slice(0, 16) })
  Object.keys(errors).forEach(k => errors[k] = '')
  isDialogVisible.value = true
}
function openShow(e: any) {
  selectedExam.value = e
  isShowDialogVisible.value = true
}


// CRUD
async function saveExam() {
  const payload = {
    name: form.name,
    intro: form.intro,
    time_open: form.time_open,
    time_close: form.time_close,
    time_limit: form.time_limit,
    grade: form.grade,
    questions_count: form.questions_count,
    exam_type: form.exam_type,
    shuffle_questions: form.shuffle_questions,
    shuffle_answers: form.shuffle_answers,
    attempts: form.attempts,
    feedback_enabled: form.feedback_enabled,
    version: form.version,
    question_pool: form.question_pool,
    status: form.status,
    is_published: form.is_published,
  };

  Object.keys(errors).forEach(k => errors[k] = '')
  try {
    if (isEditMode.value) {
      console.log('exam:', payload)
      await axios.put(`${API_BASE_URL}/exams/${selectedExam.value.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } })
    } else {
      await axios.post(`${API_BASE_URL}/exams`, form, { headers: { Authorization: `Bearer ${token}` } })
    }
    isDialogVisible.value = false
    fetchExams()
  } catch (err: any) {
    if (err.response?.data?.errors) {
      Object.assign(errors, err.response.data.errors)
    }
  }
}

async function deleteExam(id: number) {
  if (!confirm(t('exam.confirmDelete'))) return
  await axios.delete(`${API_BASE_URL}/exams/${id}`, { headers: { Authorization: `Bearer ${token}` } })
  fetchExams()
}

// utils
// import { DateTime } from 'luxon'
// function formatDate(d: string) {
//   return d ? new Date(d).toLocaleString() : '-'
//   // return d ? DateTime.fromISO(d).setLocale('fa').toFormat('yyyy/MM/dd HH:mm') : '-'
// }
import { formatDateFa } from '@/utils/dateFa'


</script>

<template>
  <section>
    <VCard>
      <VCardTitle>
        <h3 class="text-h5 mb-2 mt-2">{{ $t('exam.exam') }}</h3>
        <VSpacer />
        <VBtn class="mb-2" color="primary" @click="openCreate()">
          {{ $t('exam.new') }}
        </VBtn>
      </VCardTitle>

      <VDataTableServer :items="exams" :headers="headers" :items-length="exams.length" item-value="id"
        class="elevation-1">
        <template #item.name="{ item }">
          <VBtn variant="tonal" color="primary" @click="openShow(item)">
            <VIcon start icon="ri-eye-line" />
            {{ item.name }}
          </VBtn>
        </template>
        <template #item.course_name="{ item }">
          {{ item.course?.course_name }}
        </template>
        <template #item.time_open="{ item }">
          {{ formatDateFa(item.time_open) }}
        </template>
        <!-- <template #item.time_close="{ item }">
            {{ formatDate(item.time_close) }}
          </template> -->
        <template #item.time_limit="{ item }">
          {{ item.time_limit }} {{ $t('academy.minute') }}
        </template>
        <template #item.status="{ item }">
          <VChip :color="item.status === 'active' ? 'success' : item.status === 'draft' ? 'warning' : 'secondary'">
            {{ $t(`examStatus.${item.status}`) }}
          </VChip>
        </template>
        <template #item.is_published="{ item }">
          <VChip :color="item.is_published ? 'success' : 'secondary'">
            {{ item.is_published ? $t('course.public') : $t('course.private') }}
          </VChip>
        </template>
        <template #item.actions="{ item }">
          <!-- <VBtn class="ma-1" @click="openShow(item)">
            {{ $t('actions.show') }}
            <VIcon end icon="ri-eye-line" />
          </VBtn> -->

          <VBtn class="ma-1" variant="tonal" color="info" @click="openEdit(item)">
            {{ $t('actions.edit') }}
            <VIcon end icon="ri-pencil-line" />
          </VBtn>

          <VBtn class="ma-1" variant="tonal" color="error" @click="deleteExam(item.id)">
            {{ $t('actions.delete') }}
            <VIcon end icon="ri-delete-bin-line" />
          </VBtn>

        </template>
      </VDataTableServer>
    </VCard>

    <!-- Create / Edit Dialog -->
    <VDialog v-model="isDialogVisible" max-width="800px">
      <VCard>
        <VCardTitle class="mt-1">
          <h4>{{ isEditMode ? $t('exam.edit') : $t('exam.new') }}</h4>
        </VCardTitle>
        <VCardText>
          <VForm @submit.prevent="handleSave">
            <VRow dense class="d-flex gap-y-2">
              <VCol cols="12" sm="6">
                <VSelect v-model="form.course_id" :items="courses" item-text="title" item-value="value"
                  :label="$t('academy.courseName')" :error-messages="errors.course_id" required />
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField v-model="form.name" :label="$t('academy.Quiz')" :error-messages="errors.name" required />
              </VCol>
              <VCol cols="12">
                <VTextarea v-model="form.intro" :label="$t('academy.Description')" :error-messages="errors.intro" />
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField v-model="form.time_open" type="datetime-local" :label="$t('academy.openTime')"
                  :error-messages="errors.time_open" />
              </VCol>
              <VCol cols="12" sm="6">
                <VTextField v-model="form.time_close" type="datetime-local" :label="$t('academy.timeClose')"
                  :error-messages="errors.time_close" />
              </VCol>
              <VCol cols="12" sm="4">
                <VTextField v-model.number="form.time_limit" type="number" :label="$t('academy.timeLimit')"
                  :error-messages="errors.time_limit" />
              </VCol>
              <VCol cols="12" sm="4">
                <VTextField v-model.number="form.grade" type="number" :label="$t('academy.grade')"
                  :error-messages="errors.grade" required />
              </VCol>
              <VCol cols="12" sm="4">
                <VTextField v-model.number="form.questions_count" type="number" :label="$t('academy.numberOfQuestions')"
                  :error-messages="errors.questions_count" required />
              </VCol>
              <VCol cols="12" sm="4">
                <VSelect v-model="form.exam_type" :items="examTypes" :label="$t('academy.type')"
                  :error-messages="errors.exam_type" />
              </VCol>
              <VCol cols="12" sm="4">
                <VSwitch v-model="form.shuffle_questions" :label="$t('academy.shuffleQuestion')" />
              </VCol>
              <VCol cols="12" sm="4">
                <VSwitch v-model="form.shuffle_answers" :label="$t('academy.shuffleAnswers')" />
              </VCol>
              <VCol cols="12" sm="4">
                <VTextField v-model.number="form.attempts" type="number" :label="$t('academy.attempts')" />
              </VCol>
              <VCol cols="12" sm="4">
                <VSwitch v-model="form.feedback_enabled" :label="$t('academy.feedbackEnabled')" />
              </VCol>
              <VCol cols="12" sm="4">
                <VTextField v-model.number="form.version" type="number" :label="$t('academy.version')" />
              </VCol>
              <VCol cols="12" sm="4">
                <VSelect v-model="form.status" :items="examStatus" :label="$t('academy.status')"
                  :error-messages="errors.status" />
              </VCol>
              <VCol cols="12" sm="4">
                <VSwitch v-model="form.is_published" :label="$t('academy.is_published')"
                  :error-messages="errors.is_published" />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn variant="text" @click="isDialogVisible = false">
            {{ $t('button.close') }}
          </VBtn>
          <VBtn color="primary" @click="handleSave">
            {{ isEditMode ? $t('button.save') : $t('button.create') }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Show Dialog -->
    <VDialog v-model="isShowDialogVisible" max-width="600px">
      <VCard>
        <VCardTitle>Exam Details</VCardTitle>
        <!-- <VCardText>
          <pre>{{ selectedExam }}</pre>
        </VCardText> -->
        <VCardText>
          <VRow class="g-4">
            <VCol cols="12" sm="6">
              <VTextField :label="$t('academy.course')" :model-value="selectedExam.course.name" readonly outlined />
            </VCol>
            <VCol cols="12" sm="6">
              <VTextField :label="$t('academy.Quiz')" :model-value="selectedExam.name" readonly outlined />
            </VCol>

            <VCol cols="12">
              <VTextarea :label="$t('academy.Description')" :model-value="selectedExam.intro" readonly outlined
                rows="3" />
            </VCol>

            <VCol cols="12" sm="6">
              <VTextField :label="$t('academy.openTime')"
                :model-value="new Date(selectedExam.time_open).toLocaleString()" readonly outlined />
            </VCol>
            <VCol cols="12" sm="6">
              <VTextField :label="$t('academy.closeTime')"
                :model-value="new Date(selectedExam.time_close).toLocaleString()" readonly outlined />
            </VCol>

            <VCol cols="12" sm="4">
              <VTextField :label="$t('academy.timeLimit')" :model-value="selectedExam.time_limit + ' دقیقه'" readonly
                outlined />
            </VCol>
            <VCol cols="12" sm="4">
              <VTextField :label="$t('academy.attempts')" :model-value="selectedExam.attempts" readonly outlined />
            </VCol>
            <VCol cols="12" sm="4">
              <VTextField :label="$t('academy.status')" :model-value="selectedExam.status" readonly outlined />
            </VCol>
            <VCol cols="12" sm="4">
              <VSwitch :label="$t('academy.is_published')" :model-value="selectedExam.is_published" readonly outlined />
            </VCol>
          </VRow>
        </VCardText>
        <VCardActions class="justify-end">
          <VBtn variant="text" @click="isShowDialogVisible = false">Close</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </section>
</template>
