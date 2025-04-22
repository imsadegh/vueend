<script setup lang="ts">
import { API_BASE_URL } from '@/config/config'
import axios from 'axios'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const token = useCookie('accessToken').value

const exams = ref<any[]>([])
const totalExams = ref(0)
const selectedExam = ref<any | null>(null)
const isDialogOpen = ref(false)
const isDetailDialog = ref(false)
const form = reactive<Record<string, any>>({})
const errors = reactive<Record<string, string[]>>({})
const loading = ref(false)

/* -------------------------------------------------- */
/* utilities                                          */
/* -------------------------------------------------- */
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
        { title: $t('academy.status'), key: 'status', align: 'center' },
        { title: $t('actions.actions'), key: 'actions', align: 'center', sortable: false }
      ]" class="text-no-wrap">
        <template #item.status="{ item }">
          <VChip :color="item.status === 'active' ? 'success' : 'secondary'" size="small">
            {{ $t(`exam.${item.status}`) }}
          </VChip>
        </template>

        <template #item.actions="{ item }">
          <!-- <div class="d-flex justify-center gap-x-2"> -->
            <!-- <VBtn icon="ri-eye-line" @click="openDetail(item)" /> -->
            <!-- <VBtn icon="ri-edit-line" color="primary" @click="openEdit(item)" /> -->

            <VBtn class="ma-1" @click="openDetail(item)">
            {{ $t('actions.show') }}
            <VIcon end icon="ri-eye-line" />
          </VBtn>

          <VBtn class="ma-1" variant="tonal" color="info" @click="openEdit(item)">
            {{ $t('actions.edit') }}
            <VIcon end icon="ri-pencil-line" />
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
          <p><b>{{ $t('academy.status')}} : </b>
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
  </section>
</template>
