<script setup lang="ts">
import { API_BASE_URL } from '@/config/config'
import axios from 'axios'
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const token = useCookie('accessToken').value

const exams = ref<any[]>([])
const totalExams = ref(0)
const selectedExam = ref<any | null>(null)
const isDialogOpen = ref(false)
const isDetailDialog = ref(false)
const isAssignDialog = ref(false)
const assignedQuestions = ref<any[]>([])
const positionInputs = reactive<Record<number, number | null>>({})
const alertMsg = ref('')
const showAlert = ref(false)
const form = reactive<Record<string, any>>({})
const errors = reactive<Record<string, string[]>>({})
const loading = ref(false)

const questionsAll = ref<any[]>([])
const searchTerm = ref('')

/* -------------------------------------------------- */
/* utilities                                          */
/* -------------------------------------------------- */
const fetchAssignableQuestions = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/questions`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  questionsAll.value = data
}

const openAssign = async (exam: any) => {
  selectedExam.value = exam
  await fetchAssignableQuestions()
  const { data } = await axios.get(`${API_BASE_URL}/exams/${exam.id}/questions`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  assignedQuestions.value = data
  isAssignDialog.value = true
}

const filteredQs = computed(() => {
  const s = searchTerm.value.toLowerCase()
  return questionsAll.value.filter(
    (q: any) =>
      q.title?.toLowerCase().includes(s) ||
      q.question_text?.toLowerCase().includes(s) ||
      String(q.id).includes(s),
  )
})

const attachQuestion = async (q: any) => {
  try {
    await axios.post(
      `${API_BASE_URL}/exams/${selectedExam.value.id}/questions`,
      { question_id: q.id, position: positionInputs[q.id] ?? null },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    await openAssign(selectedExam.value)          // refresh lists
    positionInputs[q.id] = null                   // reset field
    // await fetchAssignableQuestions() // refresh list (so duplicates vanish)
  } catch (e: any) {
    if (e.response?.status === 422) {
      alertMsg.value = e.response.data?.message || $t('exam.questionExists')
      showAlert.value = true
    }
  }
}
const updatePosition = async (aq: any) => {
  const pivotId = aq.pivot.id   // ←  alias added above
  if (!pivotId) {
    alertMsg.value = $t('exam.missingPivotId')
    showAlert.value = true
    return
  }

  await axios.put(
    `${API_BASE_URL}/exams/${selectedExam.value.id}/questions/${pivotId}`,
    { position: aq.pivot.position },
    { headers: { Authorization: `Bearer ${token}` } },
  )
}

const deletePivot = async (aq: any) => {
  const pivotId = aq.pivot.id
  await axios.delete(
    `${API_BASE_URL}/exams/${selectedExam.value.id}/questions/${pivotId}`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  await openAssign(selectedExam.value)   // refresh lists
}


const fetchExams = async () => {
  loading.value = true
  try {
    const { data } = await axios.get(`${API_BASE_URL}/exams`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    exams.value = data
    totalExams.value = data.length
  } finally { loading.value = false }
}

const openDetail = (exam: any) => {
  selectedExam.value = exam
  isDetailDialog.value = true
}

const openEdit = (exam: any) => {
  selectedExam.value = exam
  // Object.assign(form, exam)          // shallow clone → form fields populated
  Object.assign(form, {
    name: exam.name,
    intro: exam.intro,
    time_limit: exam.time_limit,
    questions_count: exam.questions_count,
    exam_type: exam.exam_type,
  })
  errorsClear()
  isDialogOpen.value = true
}

const errorsClear = () => Object.keys(errors).forEach(k => delete errors[k])

/* -------------------------------------------------- */
/* update                                             */
/* -------------------------------------------------- */
const submitUpdate = async () => {
  const payload = {
    name: form.name,
    intro: form.intro,
    time_limit: form.time_limit ? Number(form.time_limit) : null,
    questions_count: form.questions_count ? Number(form.questions_count) : null,
    exam_type: form.exam_type,
  }
  try {
    await axios.put(`${API_BASE_URL}/exams/${selectedExam.value.id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
    isDialogOpen.value = false
    await fetchExams()
  } catch (err: any) {
    Object.assign(errors, err.response?.data?.errors ?? {})
  }
}

// utils
import { formatDateFa } from '@/utils/dateFa'

onMounted(fetchExams)
</script>

<template>
  <section>
    <VCard>
      <VCardTitle class="mt-1">
        <h4>{{ $t('academy.Quizzes') }}</h4>
      </VCardTitle>

      <VDataTableServer :loading="loading" :items="exams" :items-length="totalExams" :headers="[
        { title: $t('academy.Quiz'), key: 'name' },
        { title: $t('course.name'), key: 'course.course_name' },
        { title: $t('academy.openTime'), key: 'time_open' },
        { title: $t('academy.status'), key: 'status', align: 'center' },
        // { title: $t('actions.assign'), key: 'assign', align: 'center', sortable: false },
        { title: $t('actions.actions'), key: 'actions', align: 'center', sortable: false }
      ]" class="text-no-wrap">

        <template #item.name="{ item }">
          <VBtn variant="tonal" color="primary" @click="openDetail(item)">
            <VIcon start icon="ri-eye-line" />
            {{ item.name }}
          </VBtn>
        </template>
        <template #item.course.course_name="{ item }">
          {{ item.course.course_name }}
        </template>
        <template #item.time_open="{ item }">
          {{ formatDateFa(item.time_open) }}
        </template>

        <template #item.status="{ item }">
          <VChip :color="item.status === 'active' ? 'success' : item.status === 'draft' ? 'warning' : 'secondary'"
            size="small">
            {{ $t(`examStatus.${item.status}`) }}
          </VChip>
        </template>

        <template #item.actions="{ item }">
          <!-- <div class="d-flex justify-center gap-x-2"> -->
          <!-- <VBtn icon="ri-eye-line" @click="openDetail(item)" /> -->
          <!-- <VBtn icon="ri-edit-line" color="primary" @click="openEdit(item)" /> -->

          <!-- <VBtn class="ma-1" @click="openDetail(item)">
            {{ $t('actions.show') }}
            <VIcon end icon="ri-eye-line" />
          </VBtn> -->

          <VBtn class="ma-1" variant="tonal" color="info" @click="openEdit(item)">
            {{ $t('actions.edit') }}
            <VIcon end icon="ri-pencil-line" />
          </VBtn>

          <VBtn class="ma-1" variant="tonal" color="info" @click="openAssign(item)">
            {{ $t('exam.assignQuestions') }}
            <VIcon end icon="ri-add-line" />
          </VBtn>

          <!-- </div> -->
        </template>

        <template #bottom />
      </VDataTableServer>
    </VCard>

    <!-- Show exam detail -------------------------------------------->
    <VDialog v-model="isDetailDialog" width="600">
      <VCard>
        <VCardTitle class="mt-2">
          {{ selectedExam?.name }}
        </VCardTitle>
        <VCardText>
          <p><b>{{ $t('course.name') }}:</b> {{ selectedExam?.course.course_name }}</p>
          <p><b>{{ $t('academy.type') }}:</b> {{ selectedExam?.exam_type }}</p>
          <p><b>{{ $t('academy.numberOfQuestions') }}:</b> {{ selectedExam?.questions_count }}</p>
          <p><b>{{ $t('academy.status') }} : </b>
            <VChip :color="selectedExam?.status === 'active' ? 'success' : 'secondary'" size="small">
              {{ $t(`examStatus.${selectedExam?.status}`) }}
            </VChip>
          </p>
          <p><b>{{ $t('academy.Description') }}:</b> {{ selectedExam?.intro ?? '-' }}</p>
          <p><b>{{ $t('academy.timeLimit') }}:</b> {{ selectedExam?.time_limit }}</p>
          <p><b>{{ $t('academy.openTime') }}:</b> {{ selectedExam?.time_open }}</p>
          <p><b>{{ $t('academy.closeTime') }}:</b> {{ selectedExam?.time_close }}</p>
        </VCardText>
        <VCardActions>
          <VBtn @click="isDetailDialog = false">{{ $t('button.close') }}</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Edit exam --------------------------------------------------->
    <VDialog v-model="isDialogOpen" max-width="700">
      <VCard>
        <VCardTitle>{{ $t('exam.edit') }}</VCardTitle>
        <VCardText>
          <VForm @submit.prevent="submitUpdate">
            <VRow dense class="d-flex gap-y-2">
              <VCol cols="12" sm="6">
                <VTextField v-model="form.name" :label="$t('academy.Quiz')" :error-messages="errors.name" />
              </VCol>
              <!-- time‑limit -->
              <VCol cols="12" sm="6">
                <VTextField v-model="form.time_limit" type="number" :label="$t('academy.timeLimit')"
                  :error-messages="errors.time_limit" />
              </VCol>

              <!-- questions_count -->
              <VCol cols="12" sm="6">
                <VTextField v-model="form.questions_count" type="number" :label="$t('academy.numberOfQuestions')"
                  :error-messages="errors.questions_count" />
              </VCol>

              <!-- exam_type -->
              <VCol cols="12" sm="6">
                <VSelect v-model="form.exam_type" :items="['multiple_choice', 'short_answer', 'true_false', 'essay']"
                  :label="$t('academy.type')" :error-messages="errors.exam_type" />
              </VCol>

              <VCol cols="12">
                <VTextarea v-model="form.intro" :label="$t('academy.Description')" />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        <VCardActions>
          <VBtn @click="isDialogOpen = false">{{ $t('button.cancel') }}</VBtn>
          <VBtn color="primary" @click="submitUpdate">{{ $t('button.save') }}</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Assign questions to exam ------------------------------------>
    <VDialog v-model="isAssignDialog" max-width="900">
      <VCard>
        <VCardTitle>{{ $t('exam.assignQuestions') }} — {{ selectedExam?.name }}</VCardTitle>
        <VAlert v-model="showAlert" type="warning" class="mx-6 mb-2 pb-11" closable>
          {{ alertMsg }}
        </VAlert>

        <VCardText>
          <VTextField v-model="searchTerm" :label="`${$t('actions.search')} ${$t('question.questions')}`"
            prepend-inner-icon="ri-search-line" />

          <VDivider class="my-4" />

          <VDataTable :items="filteredQs" item-value="id" :headers="[
            { title: 'ID', key: 'id', width: 70 },
            { title: $t('question.title'), key: 'title' },
            { title: $t('question.type'), key: 'type', align: 'center' },
            { title: $t('exam.position'), key: 'position', align: 'center' },
            { title: $t('actions.actions'), key: 'add', align: 'center', sortable: false },
          ]" class="text-no-wrap">
            <template #item.position="{ item }">
              <VTextField v-model="positionInputs[item.id]" type="number" hide-details density="compact"
                style="max-inline-size: 4rem;"
                :rules="[value => value === null || value >= 0 || $t('validation.positiveNumber')]" />
            </template>
            <template #item.type="{ item }">
              <VChip size="small">{{ item.type.replace('_', ' ') }}</VChip>
            </template>
            <template #item.add="{ item }">
              <VBtn class="ma-1" size="small" color="primary" @click="attachQuestion(item)">
                {{ $t('actions.add') }}
                <VIcon end icon="ri-add-line" />
              </VBtn>
            </template>
          </VDataTable>

          <VDivider class="my-4" />
          <h4 class="mb-2">{{ $t('exam.assignedQuestions') }}</h4>

          <VDataTable :items="assignedQuestions" item-value="id" :headers="[
            { title: 'ID', key: 'id', width: 70 },
            { title: $t('question.title'), key: 'title' },
            { title: $t('exam.position'), key: 'pivot.position', align: 'center' },
            { title: $t('actions.actions'), key: 'manage', align: 'center', sortable: false },
            // { title: $t('actions.delete'), key: 'delete', align: 'center', sortable: false },
          ]" class="text-no-wrap">
            <template #item.pivot.position="{ item }">
              <VTextField v-model="item.pivot.position" type="number" hide-details density="compact"
                style="max-inline-size: 4rem;" />
            </template>
            <template #item.manage="{ item }">
              <VBtn class="ma-1" size="small" color="primary" @click="updatePosition(item)">
                {{ $t('actions.update') }}
                <VIcon end icon="ri-save-line" />
              </VBtn>
              <!-- </template> -->
              <!-- <template #item.delete="{ item }"> -->
              <VBtn class="ma-1" variant="tonal" size="small" color="error" @click="deletePivot(item)">
                {{ $t('actions.delete') }}
                <VIcon end icon="ri-delete-bin-line" />
              </VBtn>
            </template>

          </VDataTable>

        </VCardText>
        <VCardActions class="d-flex justify-end">
          <VBtn @click="isAssignDialog = false">{{ $t('button.close') }}</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

  </section>
</template>
