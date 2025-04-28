<script setup lang="ts">
import { API_BASE_URL } from '@/config/config'
import axios from 'axios'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t: $t } = useI18n()
const token = useCookie('accessToken').value

interface Question {
  id: number
  title: string | null
  question_text: string
  type: 'multiple_choice' | 'short_answer' | 'true_false' | 'essay'
}

const questions = ref<Question[]>([])
const total = ref(0)
const dialogMode = ref<'create' | 'edit' | 'show' | null>(null)
const selectedId = ref<number | null>(null)
const form = ref<Partial<Question & { options?: string; correct_answers?: string }>>({})
const errors = ref<Record<string, string>>({})

const headers = [
  { title: 'ID', key: 'id', width: 70 },
  { title: $t('question.title'), key: 'title' },
  { title: $t('question.type'), key: 'type', align: 'center' as 'center' },
  // { title: $t('actions.show'),    key: 'show',   align: 'center' as 'center', sortable: false },
  // { title: $t('actions.edit'),    key: 'edit',   align: 'center' as 'center', sortable: false },
  // { title: $t('actions.delete'),  key: 'delete', align: 'center' as 'center', sortable: false },
  { title: $t('actions.actions'), key: 'actions', align: 'center' as 'center', sortable: false },

]

// ---------- API ----------
const fetchQuestions = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/questions`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  // questions.value = data
  questions.value = data.sort((a: Question, b: Question) => b.id - a.id)
  total.value = data.length
}

const loadQuestion = async (id: number) => {
  const { data } = await axios.get(`${API_BASE_URL}/questions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  form.value = data
}

const saveQuestion = async () => {
  try {
    if (dialogMode.value === 'create') {
      await axios.post(`${API_BASE_URL}/questions`, form.value,
        { headers: { Authorization: `Bearer ${token}` } })
    } else {
      await axios.put(`${API_BASE_URL}/questions/${selectedId.value}`, form.value,
        { headers: { Authorization: `Bearer ${token}` } })
    }
    closeDialog()
    fetchQuestions()
  } catch (e) {
    errors.value = (e as any).response?.data?.errors || {}
  }
}

const deleteQuestion = async (id: number) => {
  if (!confirm($t('confirm.delete'))) return
  await axios.delete(`${API_BASE_URL}/questions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  fetchQuestions()
}

// ---------- dialog helpers ----------
const openCreate = () => { dialogMode.value = 'create'; form.value = {}; isDialog.value = true }
const openEdit = async (id: number) => { dialogMode.value = 'edit'; selectedId.value = id; await loadQuestion(id); isDialog.value = true }
const openShow = async (id: number) => { dialogMode.value = 'show'; selectedId.value = id; await loadQuestion(id); isDialog.value = true }
const closeDialog = () => { isDialog.value = false; errors.value = {} }

const isDialog = ref(false)
fetchQuestions()
</script>

<template>
  <section>
    <VCard>
      <VCardTitle>
        <h3 class="mt-1">{{ $t('question.questions') }}</h3>
        <!-- <VSpacer/> -->
      </VCardTitle>
      <VCardActions class="d-flex justify-strat gap-4">
        <VBtn color="primary" @click="openCreate">
          <strong>{{ $t('question.titleCreate') }}</strong>
        </VBtn>
      </VCardActions>

      <VDataTableServer :items="questions" :items-length="total" item-value="id" :headers="headers"
        class="text-no-wrap">

        <!-- title -->
        <template #item.title="{ item }">
          <VBtn variant="tonal" color="primary" @click="openShow(item.id)">
            <VIcon start icon="ri-eye-line" />
            {{ item.title }}
          </VBtn>
        </template>

        <!-- type chip -->
        <template #item.type="{ item }">
          <VChip size="small" color="info">{{ item.type.replace('_', ' ') }}</VChip>
        </template>

        <!-- actions -->
        <!-- <template #item.show="{ item }">
          <VBtn variant="plain" icon="ri-eye-line" @click="openShow(item.id)" />
        </template>
        <template #item.edit="{ item }">
          <VBtn variant="plain" icon="ri-pencil-line" @click="openEdit(item.id)" />
        </template>
        <template #item.delete="{ item }">
          <VBtn variant="plain" icon="ri-delete-bin-line" color="error" @click="deleteQuestion(item.id)" />
        </template> -->
        <template #item.actions="{ item }">
          <!-- <VBtn variant="plain" icon="ri-eye-line" @click="openShow(item.id)"/> -->
          <!-- <VBtn class="ma-1" @click="openShow(item.id)">
            {{ $t('actions.show') }}
            <VIcon end icon="ri-eye-line" />
          </VBtn> -->

          <VBtn class="ma-1" variant="tonal" color="info" @click="openEdit(item.id)">
            {{ $t('actions.edit') }}
            <VIcon end icon="ri-pencil-line" />
          </VBtn>

          <VBtn class="ma-1" variant="tonal" color="error" @click="deleteQuestion(item.id)">
            {{ $t('actions.delete') }}
            <VIcon end icon="ri-delete-bin-line" />
          </VBtn>
        </template>

        <template #bottom />
      </VDataTableServer>
    </VCard>

    <!-- CREATE / EDIT / SHOW dialog -->
    <VDialog v-model="isDialog" max-width="700">
      <VCard :title="dialogMode === 'show' ? $t('question.titleShow') :
        dialogMode === 'create' ? $t('question.titleCreate') : $t('question.titleEdit')">

        <DialogCloseBtn variant="text" size="default" @click="closeDialog" />

        <VCardText>

          <!-- readonly → show mode -->
          <VTextField v-model="form.title" :label="$t('question.title')" :disabled="dialogMode === 'show'"
            class="mb-4" />
          <VTextarea v-model="form.question_text" :label="$t('question.text')" :disabled="dialogMode === 'show'"
            class="mb-4" />

          <VSelect v-if="dialogMode !== 'show'" v-model="form.type" :items="[
            // { title: $t('question.multiple_choice'), value: 'multiple_choice' },
            { title: $t('question.short_answer'), value: 'short_answer' },
            // { title: $t('question.true_false'), value: 'true_false' },
            { title: $t('question.essay'), value: 'essay' },
          ]" :label="$t('question.type')" />

          <!-- MCQ helpers (simple textarea JSON for now) -->
          <template v-if="dialogMode !== 'show' && form.type === 'multiple_choice'">
            <VTextarea v-model="form.options" :label="$t('question.optionsJSON')" hint='["A","B","C"]' />
            <VTextarea v-model="form.correct_answers" :label="$t('question.correctJSON')" hint='["A"]' />
          </template>


        </VCardText>

        <VCardActions v-if="dialogMode !== 'show'" class="d-flex justify-end gap-4">
          <VBtn color="secondary" @click="closeDialog">{{ $t('button.close') }}</VBtn>
          <VBtn color="primary" @click="saveQuestion">{{ $t('button.save') }}</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </section>
</template>
