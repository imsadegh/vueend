
<script setup lang="ts">
// import { useCookie } from '#imports'; // or your app's cookie composable
import { API_BASE_URL } from '@/config/config'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const token = useCookie('accessToken').value

// State for courses, user-selected course, payment method, etc.
const courses = ref<Array<{ id: number; course_name: string }>>([])
const courseId = ref<number | null>(null)
const paymentMethod = ref('credit_card')
const paymentMethods = ref([
  { text: 'Credit Card', value: 'credit_card' },
  { text: 'Bank Transfer', value: 'bank_transfer' },
  { text: 'zarinpal', value: 'zarinpal' },
  { text: 'Cash', value: 'cash' },
])
const amountPaid = ref<number>(0)

const tuitionFee = ref<number>(0)
const totalPaid = ref<number>(0)
const remainingBalance = ref<number>(0)

// Messages
const successMessage = ref('')
const errorMessage = ref('')

// Fetch the list of courses from the API
async function fetchCourses() {
  try {
    const response = await axios.get(`${API_BASE_URL}/courses?visible=1&active=1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    courses.value = response.data;
  } catch (error) {
    console.error('Error fetching courses:', error.response?.data || error.message);
  }
}

async function fetchTuitionSummary() {
  try {
    const res = await axios.get(`${API_BASE_URL}/tuition/summary`, {
      params: { course_id: courseId.value },
      headers: { Authorization: `Bearer ${token}` }
    });
    tuitionFee.value = res.data.tuition_fee;
    totalPaid.value = res.data.total_paid;
    remainingBalance.value = res.data.remaining_balance;
  } catch (error) {
    console.error('Error fetching tuition summary:', error.response?.data || error.message);
  }
}

// Payment submission
async function payTuition() {
  successMessage.value = ''
  errorMessage.value = ''

  if (!courseId.value) {
    errorMessage.value = 'Please select a course.'
    return
  }

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

    successMessage.value = res.data.message
    await fetchTuitionSummary()
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0] ||
      'Payment error occurred.'
  } finally {
    // Ensure fetchTuitionSummary() runs even if payment fails
    fetchTuitionSummary()
  }
}

watch(courseId, (newVal) => {
  if (newVal) {
    fetchTuitionSummary();
  }
});

// Fetch courses when component is mounted
onMounted(() => {
  fetchCourses()
})


const formattedTuitionFee = computed(() => new Intl.NumberFormat('en-US').format(tuitionFee.value))
const formattedTotalPaid = computed(() => new Intl.NumberFormat('en-US').format(totalPaid.value))
const formattedRemainingBalance = computed(() => new Intl.NumberFormat('en-US').format(remainingBalance.value))

</script>

<template>
  <section>
    <VCard class="d-flex flex-column gap-4 pa-4">
      <VCardTitle>{{ $t('tuition.payTuition') }}</VCardTitle>
      <VCardText>
        <!-- Select a Course -->
        <VForm @submit.prevent="payTuition" class="d-flex flex-column gap-4">
          <!-- Select a Course -->
          <VSelect
            v-model="courseId"
            :items="courses"
            item-title="course_name"  
            item-value="id"
            :label="$t('tuition.selectCourse')"
            outlined
            required
          />

          <!-- Select a Payment Method -->
          <VSelect
            v-model="paymentMethod"
            :items="paymentMethods"
            item-title="text"
            item-value="value"
            :label="$t('tuition.paymentMethod')"
            outlined
            required
          />

          <!-- Amount -->
          <VTextField
            v-model="amountPaid"
            :label="$t('tuition.amount')"
            type="number"
            step="0.01"
            min="0"
            outlined
            required
          />

          <div v-if="courseId">
            <p>{{ $t('tuition.courseCost') }}: {{ formattedTuitionFee }} ریال</p>
            <p>{{ $t('tuition.totalPaid') }}: {{ formattedTotalPaid }} ریال</p>
            <p>{{ $t('tuition.remainingBalance') }}: {{ formattedRemainingBalance }} ریال</p>
          </div>

          <VBtn type="submit" color="primary" class="mt-4">
            {{ $t('button.pay') }}
          </VBtn>
        </VForm>

        <!-- Success / Error Messages -->
        <div v-if="successMessage" class="text-success mt-4">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="text-error mt-4">
          {{ errorMessage }}
        </div>
      </VCardText>
    </VCard>
  </section>
</template>
