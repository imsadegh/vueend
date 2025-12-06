<script setup lang="ts">
import { API_BASE_URL } from '@/config/config'
import axios from 'axios'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const token = useCookie('accessToken').value

// State for courses, user-selected course, payment method, etc.
interface Course {
  id: number
  course_name: string
  tuition_fee?: number
  description?: string
  thumbnail_url?: string
}

const courses = ref<Course[]>([])
const courseId = ref<number | null>(null)
const selectedCourse = ref<Course | null>(null)
const paymentMethod = ref('zarinpal')
const paymentMethods = ref([
  { text: $t('tuition.zarinpal'), value: 'zarinpal', icon: 'ri-bank-card-line', color: 'warning' },
  { text: $t('tuition.bankTransfer'), value: 'bank_transfer', icon: 'ri-building-line', color: 'info' },
  { text: $t('tuition.creditCard'), value: 'credit_card', icon: 'ri-visa-line', color: 'primary' },
  { text: $t('tuition.cash'), value: 'cash', icon: 'ri-money-dollar-circle-line', color: 'success' },
])
const amountPaid = ref<number>(0)

const tuitionFee = ref<number>(0)
const totalPaid = ref<number>(0)
const remainingBalance = ref<number>(0)

// UI State
const isLoading = ref(false)
const isPaymentLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const showPaymentDialog = ref(false)

// Fetch the list of courses from the API
async function fetchCourses() {
  isLoading.value = true
  try {
    const response = await axios.get(`${API_BASE_URL}/courses?visible=1&includeDraft=1`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    courses.value = response.data
  } catch (error) {
    console.error('Error fetching courses:', (error as any).response?.data || (error as any).message)
  } finally {
    isLoading.value = false
  }
}

async function fetchTuitionSummary() {
  if (!courseId.value) return
  try {
    const res = await axios.get(`${API_BASE_URL}/tuition/summary`, {
      params: { course_id: courseId.value },
      headers: { Authorization: `Bearer ${token}` },
    })
    tuitionFee.value = res.data.tuition_fee
    totalPaid.value = res.data.total_paid
    remainingBalance.value = res.data.remaining_balance
  } catch (error) {
    console.error('Error fetching tuition summary:', (error as any).response?.data || (error as any).message)
  }
}

// Payment submission
async function payTuition() {
  successMessage.value = ''
  errorMessage.value = ''

  if (!courseId.value) {
    errorMessage.value = $t('tuition.selectCourseError')
    return
  }

  if (amountPaid.value <= 0) {
    errorMessage.value = $t('tuition.invalidAmount')
    return
  }

  isPaymentLoading.value = true
  try {
    const res = await axios.post(
      `${API_BASE_URL}/tuition/pay`,
      {
        course_id: courseId.value,
        amount_paid: amountPaid.value,
        payment_method: paymentMethod.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    successMessage.value = res.data.message || $t('tuition.paymentSuccess')
    showPaymentDialog.value = false
    amountPaid.value = 0
    await fetchTuitionSummary()
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0] ||
      $t('tuition.paymentError')
  } finally {
    isPaymentLoading.value = false
  }
}

function selectCourse(course: Course) {
  courseId.value = course.id
  selectedCourse.value = course
}

function openPaymentDialog() {
  if (!courseId.value) {
    errorMessage.value = $t('tuition.selectCourseError')
    return
  }
  showPaymentDialog.value = true
  errorMessage.value = ''
}

watch(courseId, (newVal) => {
  if (newVal) {
    fetchTuitionSummary()
  }
})

// Fetch courses when component is mounted
onMounted(() => {
  fetchCourses()
})

const formattedTuitionFee = computed(() => new Intl.NumberFormat('fa-IR').format(tuitionFee.value))
const formattedTotalPaid = computed(() => new Intl.NumberFormat('fa-IR').format(totalPaid.value))
const formattedRemainingBalance = computed(() => new Intl.NumberFormat('fa-IR').format(remainingBalance.value))
const paymentProgress = computed(() => {
  if (tuitionFee.value === 0) return 0
  return Math.min(100, Math.round((totalPaid.value / tuitionFee.value) * 100))
})
</script>

<template>
  <div>
    <!-- Header Section -->
    <VCard class="mb-6">
      <VCardText class="text-center py-8">
        <h2 class="text-h2 mb-2">{{ $t('tuition.pageTitle') }}</h2>
        <p class="text-body-1 text-medium-emphasis">
          {{ $t('tuition.pageSubtitle') }}
        </p>
      </VCardText>
    </VCard>

    <VRow>
      <!-- Course Selection Section -->
      <VCol cols="12" md="8">
        <VCard>
          <VCardTitle class="d-flex align-center justify-space-between pa-4">
            <div class="d-flex align-center gap-2">
              <VIcon icon="ri-book-open-line" color="primary" />
              <span>{{ $t('tuition.availableCourses') }}</span>
            </div>
            <VBtn
              icon
              variant="text"
              color="default"
              size="small"
              :loading="isLoading"
              @click="fetchCourses"
            >
              <VIcon icon="ri-refresh-line" />
            </VBtn>
          </VCardTitle>

          <VCardText>
            <!-- Loading State -->
            <div v-if="isLoading" class="d-flex justify-center py-8">
              <VProgressCircular indeterminate color="primary" />
            </div>

            <!-- Empty State -->
            <div v-else-if="courses.length === 0" class="text-center py-8">
              <VIcon icon="ri-book-line" size="64" color="disabled" class="mb-4" />
              <p class="text-body-1 text-disabled">{{ $t('tuition.noCourses') }}</p>
            </div>

            <!-- Course Cards -->
            <VRow v-else>
              <VCol
                v-for="course in courses"
                :key="course.id"
                cols="12"
                sm="6"
              >
                <VCard
                  flat
                  border
                  :class="[
                    'cursor-pointer transition-all',
                    courseId === course.id ? 'border-primary border-opacity-100 bg-primary-lighten-5' : 'hover-border-primary'
                  ]"
                  @click="selectCourse(course)"
                >
                  <VCardText class="pa-4">
                    <div class="d-flex align-start gap-4">
                      <VAvatar
                        v-if="course.thumbnail_url"
                        :image="course.thumbnail_url"
                        size="56"
                        rounded
                      />
                      <VAvatar
                        v-else
                        color="primary"
                        variant="tonal"
                        size="56"
                        rounded
                      >
                        <VIcon icon="ri-book-2-line" size="28" />
                      </VAvatar>

                      <div class="flex-grow-1">
                        <div class="d-flex justify-space-between align-start">
                          <h6 class="text-h6 mb-1">{{ course.course_name }}</h6>
                          <VIcon
                            v-if="courseId === course.id"
                            icon="ri-checkbox-circle-fill"
                            color="primary"
                            size="20"
                          />
                        </div>
                        <p
                          v-if="course.description"
                          class="text-body-2 text-disabled mb-0 text-truncate"
                          style="max-width: 200px;"
                        >
                          {{ course.description }}
                        </p>
                      </div>
                    </div>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Payment Summary Section -->
      <VCol cols="12" md="4">
        <VCard class="sticky-card">
          <VCardTitle class="d-flex align-center gap-2 pa-4">
            <VIcon icon="ri-wallet-3-line" color="primary" />
            <span>{{ $t('tuition.paymentSummary') }}</span>
          </VCardTitle>

          <VCardText>
            <!-- No Course Selected -->
            <div v-if="!courseId" class="text-center py-6">
              <VIcon icon="ri-arrow-left-line" size="48" color="disabled" class="mb-4" />
              <p class="text-body-2 text-disabled">{{ $t('tuition.selectCourseHint') }}</p>
            </div>

            <!-- Payment Details -->
            <div v-else>
              <!-- Selected Course -->
              <div class="mb-6">
                <p class="text-caption text-disabled mb-1">{{ $t('tuition.selectedCourse') }}</p>
                <h5 class="text-h5">{{ selectedCourse?.course_name }}</h5>
              </div>

              <!-- Progress -->
              <div class="mb-6">
                <div class="d-flex justify-space-between mb-2">
                  <span class="text-body-2">{{ $t('tuition.paymentProgress') }}</span>
                  <span class="text-body-2 font-weight-medium">{{ paymentProgress }}%</span>
                </div>
                <VProgressLinear
                  :model-value="paymentProgress"
                  :color="paymentProgress >= 100 ? 'success' : 'primary'"
                  height="10"
                  rounded
                />
              </div>

              <!-- Amount Details -->
              <VList class="bg-transparent pa-0">
                <VListItem class="px-0">
                  <template #prepend>
                    <VAvatar color="primary" variant="tonal" size="40" rounded>
                      <VIcon icon="ri-price-tag-3-line" size="20" />
                    </VAvatar>
                  </template>
                  <VListItemTitle class="text-body-2 text-disabled">
                    {{ $t('tuition.courseCost') }}
                  </VListItemTitle>
                  <VListItemSubtitle class="text-h6 text-high-emphasis">
                    {{ formattedTuitionFee }} {{ $t('tuition.currency') }}
                  </VListItemSubtitle>
                </VListItem>

                <VListItem class="px-0">
                  <template #prepend>
                    <VAvatar color="success" variant="tonal" size="40" rounded>
                      <VIcon icon="ri-checkbox-circle-line" size="20" />
                    </VAvatar>
                  </template>
                  <VListItemTitle class="text-body-2 text-disabled">
                    {{ $t('tuition.totalPaid') }}
                  </VListItemTitle>
                  <VListItemSubtitle class="text-h6 text-success">
                    {{ formattedTotalPaid }} {{ $t('tuition.currency') }}
                  </VListItemSubtitle>
                </VListItem>

                <VListItem class="px-0">
                  <template #prepend>
                    <VAvatar color="warning" variant="tonal" size="40" rounded>
                      <VIcon icon="ri-time-line" size="20" />
                    </VAvatar>
                  </template>
                  <VListItemTitle class="text-body-2 text-disabled">
                    {{ $t('tuition.remainingBalance') }}
                  </VListItemTitle>
                  <VListItemSubtitle class="text-h6 text-warning">
                    {{ formattedRemainingBalance }} {{ $t('tuition.currency') }}
                  </VListItemSubtitle>
                </VListItem>
              </VList>

              <!-- Pay Button -->
              <VBtn
                block
                color="primary"
                size="large"
                class="mt-6"
                :disabled="remainingBalance <= 0"
                @click="openPaymentDialog"
              >
                <VIcon start icon="ri-bank-card-line" />
                {{ remainingBalance <= 0 ? $t('tuition.fullyPaid') : $t('tuition.payNow') }}
              </VBtn>

              <!-- Fully Paid Badge -->
              <div v-if="remainingBalance <= 0" class="text-center mt-4">
                <VChip color="success" size="small">
                  <VIcon start icon="ri-check-line" size="16" />
                  {{ $t('tuition.courseFullyPaid') }}
                </VChip>
              </div>
            </div>
          </VCardText>
        </VCard>

        <!-- Messages -->
        <VAlert
          v-if="successMessage"
          type="success"
          variant="tonal"
          closable
          class="mt-4"
          @click:close="successMessage = ''"
        >
          {{ successMessage }}
        </VAlert>

        <VAlert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          closable
          class="mt-4"
          @click:close="errorMessage = ''"
        >
          {{ errorMessage }}
        </VAlert>
      </VCol>
    </VRow>

    <!-- Payment Dialog -->
    <VDialog v-model="showPaymentDialog" max-width="500">
      <VCard>
        <VCardTitle class="d-flex align-center justify-space-between pa-4">
          <div class="d-flex align-center gap-2">
            <VIcon icon="ri-secure-payment-line" color="primary" />
            <span>{{ $t('tuition.payTuition') }}</span>
          </div>
          <VBtn icon variant="text" size="small" @click="showPaymentDialog = false">
            <VIcon icon="ri-close-line" />
          </VBtn>
        </VCardTitle>

        <VDivider />

        <VCardText class="pa-4">
          <!-- Course Info -->
          <div class="d-flex align-center gap-3 pa-3 bg-var-theme-background rounded mb-4">
            <VAvatar color="primary" variant="tonal" size="48" rounded>
              <VIcon icon="ri-book-2-line" size="24" />
            </VAvatar>
            <div>
              <p class="text-caption text-disabled mb-0">{{ $t('tuition.payingFor') }}</p>
              <h6 class="text-h6">{{ selectedCourse?.course_name }}</h6>
            </div>
          </div>

          <!-- Remaining Balance -->
          <div class="text-center mb-6">
            <p class="text-caption text-disabled mb-1">{{ $t('tuition.remainingBalance') }}</p>
            <h3 class="text-h3 text-warning">
              {{ formattedRemainingBalance }} {{ $t('tuition.currency') }}
            </h3>
          </div>

          <VForm @submit.prevent="payTuition">
            <!-- Payment Method -->
            <p class="text-body-2 font-weight-medium mb-2">{{ $t('tuition.paymentMethod') }}</p>
            <VRow class="mb-4">
              <VCol
                v-for="method in paymentMethods"
                :key="method.value"
                cols="6"
              >
                <VCard
                  flat
                  border
                  :class="[
                    'cursor-pointer text-center pa-3',
                    paymentMethod === method.value ? `border-${method.color} border-opacity-100` : ''
                  ]"
                  @click="paymentMethod = method.value"
                >
                  <VIcon :icon="method.icon" :color="method.color" size="28" class="mb-2" />
                  <p class="text-body-2 mb-0">{{ method.text }}</p>
                </VCard>
              </VCol>
            </VRow>

            <!-- Amount -->
            <VTextField
              v-model.number="amountPaid"
              :label="$t('tuition.amount')"
              type="number"
              :suffix="$t('tuition.currency')"
              variant="outlined"
              :min="0"
              :max="remainingBalance"
              class="mb-4"
            >
              <template #append-inner>
                <VBtn
                  size="x-small"
                  variant="text"
                  color="primary"
                  @click="amountPaid = remainingBalance"
                >
                  {{ $t('tuition.payFull') }}
                </VBtn>
              </template>
            </VTextField>

            <!-- Submit Button -->
            <VBtn
              type="submit"
              block
              color="primary"
              size="large"
              :loading="isPaymentLoading"
              :disabled="amountPaid <= 0 || isPaymentLoading"
            >
              <VIcon start icon="ri-check-line" />
              {{ $t('tuition.confirmPayment') }}
            </VBtn>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<style lang="scss" scoped>
.sticky-card {
  position: sticky;
  top: 80px;
}

.hover-border-primary {
  &:hover {
    border-color: rgb(var(--v-theme-primary)) !important;
  }
}

.transition-all {
  transition: all 0.2s ease-in-out;
}

.bg-var-theme-background {
  background-color: rgb(var(--v-theme-grey-100));
}

.bg-primary-lighten-5 {
  background-color: rgba(var(--v-theme-primary), 0.08);
}
</style>
