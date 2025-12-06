<script setup lang="ts">
// import { API_BASE_URL } from '@/config/config'
// import axios from 'axios'

// import LmsPaymentHistory from '@/views/dashboards/lms/LmsPaymentHistory.vue'
// import LmsExamAttempt from '@/views/dashboards/lms/LmsExamAttempt.vue'

import AcademyMyCourses from '@/views/dashboards/lms/LmsMyCourses.vue'
// import LmsTuitionHistory from '@/views/dashboards/lms/LmsTuitionHistory.vue'
const searchQuery = ref('')

import customCheck from '@images/svg/check.svg'
import customLaptop from '@images/svg/laptop.svg'
import customLightbulb from '@images/svg/lightbulb.svg'

// TODO: Get type from backend
const userData = useCookie<any>('userData')


// const availableExams = ref<any[]>([])
// const selected = ref<number | null>(null)

// // student-visible, published + active exams
// const fetchAvailableExams = async () => {
//   const { data } = await axios.get(`${API_BASE_URL}/exams`, {
//     headers: { Authorization: `Bearer ${useCookie('accessToken').value}` },
//     // params: { scope: 'student' },            // ← adjust to your own filter if needed
//   })
//   availableExams.value = data
// }

// onMounted(fetchAvailableExams)


// Donut Chart Colors
const donutChartColors = {
  donut: {
    series1: '#5BB420',
    series2: '#67CB24',
    series3: '#72E128',
    series4: '#8EE753',
    series5: '#AAED7E',
    series6: '#C7F3A9',
  },
}

// Donuts Chart Config
const timeSpendingChartConfig = {
  chart: {
    height: 157,
    width: 130,
    parentHeightOffset: 0,
    type: 'donut',
  },
  labels: ['36h', '56h', '16h', '32h', '56h', '16h'],
  colors: [
    donutChartColors.donut.series1,
    donutChartColors.donut.series2,
    donutChartColors.donut.series3,
    donutChartColors.donut.series4,
    donutChartColors.donut.series5,
    donutChartColors.donut.series6,
  ],
  stroke: {
    width: 0,
  },
  dataLabels: {
    enabled: false,
    formatter(val: string) {
      return `${Number.parseInt(val)}%`
    },
  },
  legend: {
    show: false,
  },
  tooltip: {
    theme: false,
  },
  grid: {
    padding: {
      top: 0,
    },
  },
  plotOptions: {
    pie: {
      donut: {
        size: '75%',
        labels: {
          show: true,
          value: {
            fontSize: '1.125rem',
            color: 'rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity))',
            fontWeight: 500,
            offsetY: -15,
            formatter(val: string) {
              return `${Number.parseInt(val)}%`
            },
          },
          name: {
            offsetY: 20,
          },
          total: {
            show: true,
            fontSize: '.7rem',
            label: 'Total',
            color: 'rgba(var(--v-theme-on-background), var(--v-disabled-opacity))',
            formatter() {
              return '231h'
            },
          },
        },
      },
    },
  },
}

const timeSpendingChartSeries = [23, 35, 10, 20, 35, 23]
</script>

<template>
  <div>
    <VRow class="py-5 match-height">
      <!-- 👉 Welcome -->
      <VCol cols="12" md="8" :class="$vuetify.display.mdAndUp ? 'border-e' : 'border-b'">
        <div class="pe-3">
          <div class="mb-2">
            <span class="text-h5">
              {{ $t('welcome_back') }},
            </span>
            <span class="text-h4">
              {{ userData.first_name }} 👋🏻
            </span>
          </div>

          <div class="text-wrap text-body-1 mb-4" style="max-inline-size: 400px;">
            {{ $t('academy.progress_awesome') }}
          </div>

          <div class="d-flex justify-space-between flex-wrap gap-6 flex-column flex-md-row">
            <div v-for="{ title, value, icon, color } in [
              { title: 'ساعات صرف شده', value: '34 ساعت', icon: customLaptop, color: 'primary' },
              { title: 'نتایج آزمون', value: '82%', icon: customLightbulb, color: 'info' },
              { title: 'دوره‌های تکمیل‌شده', value: '14', icon: customCheck, color: 'warning' },
            ]" :key="title">
              <div class="d-flex">
                <VAvatar variant="tonal" :color="color" rounded size="54" class="text-primary me-4">
                  <VIcon :icon="icon" size="38" />
                </VAvatar>
                <div>
                  <h6 class="text-h6 text-medium-emphasis">
                    {{ title }}
                  </h6>
                  <h4 class="text-h4" :class="`text-${color}`">
                    {{ value }}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </VCol>

      <VRow class="match-height">
        <!-- 👉 Award -->
        <!-- <VCol cols="12" md="4">
          <LmsCongratulationsNorris />
        </VCol> -->

        <!-- 👉 Payment History -->
        <!-- <VCol cols="12" md="4">
          <LmsPaymentHistory />
        </VCol> -->
      </VRow>

      <!-- 👉 Time Spending -->
      <VCol cols="12" md="4">
        <div class="d-flex justify-space-between align-center">
          <div class="d-flex flex-column ps-3">
            <h5 class="text-h5 mb-1 text-no-wrap">
              {{ $t('academy.time_spending') }}
            </h5>
            <div class="mb-6 text-body-1">
              {{ $t('academy.weekly_report') }}
            </div>
            <h4 class="text-h4 mb-2">
              231<span class="text-medium-emphasis">
                {{ $t('academy.hour') }}
              </span> 14<span class="text-medium-emphasis">
                {{ $t('academy.minute') }}
              </span>
            </h4>
            <div>
              <VChip color="success" density="comfortable">
                +18.4%
              </VChip>
            </div>
          </div>
          <div>
            <VueApexCharts type="donut" height="150" width="150" :options="timeSpendingChartConfig"
              :series="timeSpendingChartSeries" />
          </div>
        </div>
      </VCol>
    </VRow>

    <VRow class="match-height">
      <!-- 👉 Tuition History -->
      <!-- <VCol cols="12" md="4">
        <LmsTuitionHistory />
      </VCol> -->

      <!-- 👉 Topic You are Interested in -->
      <!-- <VCol cols="12" md="8">
        <AcademyCardInterestedTopics />
      </VCol> -->

      <!-- 👉 Popular Instructors  -->
      <!-- <VCol cols="12" md="4" sm="6">
        <AcademyCardPopularInstructors />
      </VCol> -->

      <!-- 👉 Academy Top Courses  -->
      <!-- <VCol cols="12" md="4" sm="6">
        <AcademyCardTopCourses />
      </VCol> -->

      <!-- 👉 Academy Upcoming Webinar -->
      <!-- <VCol cols="12" md="4" sm="6">
        <AcademyUpcomingWebinar />
      </VCol> -->

      <!-- 👉 Academy Assignment Progress  -->
      <!-- <VCol cols="12" md="4" sm="6">
        <AcademyAssignmentProgress />
      </VCol> -->

      <!-- 👉 Academy Course Table  -->
      <!-- <VCol>
        <AcademyCourseTable />
      </VCol> -->

      <!-- 👉 my-course Table  -->
      <VCol cols="12" md="12" sm="6">
        <!-- <MyCourse /> -->
        <AcademyMyCourses :search-query="searchQuery" />
      </VCol>

      <!-- <LmsExamAttempt /> -->
      <!-- 👉 exam attempt-->
      <!-- <VCol cols="12" md="4" sm="6">
        <VList>
          <VListItem
            v-for="exam in availableExams"
            :key="exam.id"
            @click="selected = exam.id"
            class="cursor-pointer"
          >
            <VListItemTitle>{{ exam.name }}</VListItemTitle>
          </VListItem>
        </VList>

        <LmsExamAttempt
          v-if="selected"
          :exam-id="selected"
          class="mt-4"
        />
      </VCol> -->

    </VRow>
  </div>
</template>
