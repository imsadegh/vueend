<script setup lang="ts">
import { API_BASE_URL } from '@/config/config';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';

/* props */
const props = defineProps<{ courseId: number; modelValue: boolean }>()
// const emit  = defineEmits<['update:modelValue']>()
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

const token = useCookie('accessToken').value
const scores = ref<any[]>([])
const loading = ref(false)

/* fetch scores for this course */
const fetchScores = async () => {
  if (!props.courseId) return
  loading.value = true
  try {
    const { data } = await axios.get(`${API_BASE_URL}/exam-scores`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { course_id: props.courseId },
    })
    scores.value = data
  } finally {
    loading.value = false
  }
}

watch(() => props.modelValue, (v) => v && fetchScores())
onMounted(fetchScores)
</script>

<template>
  <VDialog :model-value="props.modelValue" max-width="700" @update:model-value="emit('update:modelValue', $event)">
    <VCard>
      <VCardTitle>
        {{ $t('exam.myScores') }}
      </VCardTitle>

      <VCardText>
        <VDataTable :loading="loading" :items="scores" :headers="[
          { title: $t('exam.title'), key: 'exam_title' },
          // { title: $t('exam.score'), key: 'score', align: 'center' },

          // { title: $t('exam.finalGrade'), key: 'final_grade', align: 'center' },
          { title: $t('exam.finalGrade'), key: 'reviewScore', align: 'center' },
          { title: $t('exam.passed'), key: 'is_passed', align: 'center' },
          { title: $t('exam.detailScore'), key: 'data-table-expand' },
        ]" class="text-no-wrap" show-expand>

          <template #item.reviewScore="{ item }">
            <template v-if="item.last_reviewed_at">
              {{ item.final_grade ?? item.score }}
            </template>
            <VChip v-else color="warning" size="small">
              {{ $t('exam.notReviewed') }}
            </VChip>
          </template>

          <template #item.is_passed="{ item }">
            <template v-if="item.last_reviewed_at">
              <VChip size="small" :color="item.is_passed ? 'success' : 'error'">
                {{ item.is_passed ? $t('true') : $t('false') }}
              </VChip>
            </template>
            <VChip v-else color="warning" size="small">
              {{ $t('exam.notReviewed') }}
            </VChip>
          </template>

          <!-- ▸ details row -->
          <template #expanded-row="{ item }">
            <tr>
              <td :colspan="5" class="py-2">
                <div v-if="item.last_reviewed_at && item.score_details?.length">
                  <VList dense>
                    <VListItem v-for="d in item.score_details" :key="d.question_id" class="px-0">
                      <VListItemTitle>
                        سوال {{ d.question_id }} — {{ $t('exam.earned') }}: <strong>{{ d.earned }}</strong>
                      </VListItemTitle>
                    </VListItem>
                  </VList>
                </div>
                <div v-else class="text-medium-emphasis">
                  {{ item.last_reviewed_at ? $t('exam.noDetails') : $t('exam.notReviewed') }}
                </div>

                <!-- ── instructor feedback ───────────────────── -->

                <div>
                  <strong>{{ $t('exam.feedback') }}: </strong>

                  <span v-if="item.last_reviewed_at && item.grading_feedback?.note">
                    {{ item.grading_feedback.note }}
                  </span>
                  <span v-else class="text-medium-emphasis">
                    {{ $t('exam.noFeedback') }}
                  </span>
                  <!-- <div v-if="item.last_reviewed_at" class="mt-1 text-body-2">
                    {{ $t('exam.reviewedBy') }}:
                    <strong>{{ item.reviewer?.full_name || '—' }}</strong>
                    <span class="text-disabled">— {{ $d(new Date(item.last_reviewed_at), 'short') }}</span>
                  </div> -->
                </div>
              </td>
            </tr>
          </template>

        </VDataTable>
      </VCardText>

      <VCardActions class="justify-end">
        <VBtn @click="emit('update:modelValue', false)">
          {{ $t('button.close') }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
