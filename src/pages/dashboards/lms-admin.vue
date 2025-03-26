<script setup lang="ts">
import LmsCongratulationsNorris from '@/views/dashboards/lms/LmsCongratulationsNorris.vue';
import LmsCourseCreate from '@/views/dashboards/lms/LmsCourseCreate.vue';
import LmsEnrollStudents from '@/views/dashboards/lms/LmsEnrollStudents.vue';

// TODO - add vuetify Outlined Timeline component with its backend
// TODO - register new student
// TODO for the panel admin, should be able to see the list of students and their courses, also instructors and be able to edit the courses info

const statisticsVertical = [
  {
    title: 'Total Orders',
    color: 'primary',
    icon: 'ri-shopping-cart-line',
    stats: '155k',
    change: 22,
    subtitle: 'Last 4 months',
  },
  {
    title: 'Total Sales',
    color: 'success',
    icon: 'ri-handbag-line',
    stats: '13.4k',
    change: 38,
    subtitle: 'Last Six months',
  },
]
</script>

<template>
  <VRow class="match-height">
    <!-- 👉 Welcome -->
    <VCol cols="12" md="4">
      <LmsCongratulationsNorris />
    </VCol>

    <!-- 👉 Create Course -->
    <VCol cols="12" md="4">
      <LmsCourseCreate />
    </VCol>

    <!-- 👉 Enroll Students -->
    <VCol cols="12" md="4">
      <LmsEnrollStudents />
    </VCol>

    <!-- 👉 Total Orders -->
    <VCol v-for="statistics in statisticsVertical" :key="statistics.title" cols="12" sm="3" md="2">
      <!-- <CardStatisticsVertical v-bind="statistics" /> -->
    </VCol>

    <!-- 👉 Profile Line Charts -->
    <VCol cols="12" sm="3" md="2">
      <!-- <LmsProfitBarWithGapCharts /> -->
    </VCol>

    <!-- 👉 Total Growth -->
    <VCol cols="12" md="2" sm="3">
      <!-- <LmsGrowthDonutCharts /> -->
    </VCol>

    <!-- 👉 Organic Sessions -->
    <VCol cols="12" md="4">
      <!-- <LmsOrganicSessions /> -->
    </VCol>

    <!-- 👉 Project Timeline -->
    <VCol cols="12" md="8">
      <!-- <LmsProjectTimeline />+++++++++++ -->
    </VCol>

    <!-- 👉 Weekly Overview -->
    <VCol cols="12" sm="6" md="4">
      <!-- <LmsWeeklyOverview /> -->
    </VCol>

    <!-- 👉 Social Network Visits -->
    <VCol cols="12" sm="6" md="4">
      <!-- <LmsSocialNetworkVisits /> -->
    </VCol>

    <!-- 👉 Monthly Budget -->
    <VCol cols="12" md="4" sm="6">
      <!-- <LmsMonthlyBudget /> -->
    </VCol>

    <!-- 👉 Meeting Schedule -->
    <VCol cols="12" md="4" sm="6">
      <!-- <LmsMeetingSchedule />+++++++++++++ -->
    </VCol>

    <!-- 👉 External Links -->
    <VCol cols="12" sm="6" md="4">
      <!-- <LmsExternalLinks /> -->
    </VCol>

    <!-- 👉 Payment History -->
    <VCol cols="12" sm="6" md="4">
      <!-- <LmsPaymentHistory />++++++++++++++ -->
    </VCol>

    <!-- 👉 Most Sales in Countries -->
    <VCol cols="12" md="4">
      <!-- <LmsMostSalesInCountries />++++++++++++ -->
    </VCol>

    <!-- 👉 User List -->
    <VCol cols="12" md="8">
      <!-- <LmsUserList />+++++++++++++ -->
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart";
</style>
