<script setup lang="ts">
import LmsCongratulationsNorris from '@/views/dashboards/lms/LmsCongratulationsNorris.vue';
import LmsTuitionHistory from '@/views/dashboards/lms/LmsTuitionHistory.vue';

// definePage({
//   meta: {
//     // layout: 'blank',
//     // unauthenticatedOnly: true,
//     layout: 'blank',
//     action: 'manage',
//     subject: 'Course',
//   },
// })

</script>

<template>
  <VRow class="match-height">
    <!-- سلام -->
    <!-- 👉 Award -->
    <VCol cols="12" md="4">
      <LmsCongratulationsNorris />
    </VCol>
  </VRow>

  <VRow class="match-height">

    <!-- 👉 Payment History -->
    <!-- <VCol cols="12" md="4">
      <LmsPaymentHistory />
    </VCol> -->

    <!-- 👉 Tuition History -->
    <VCol cols="12" md="4">
      <LmsTuitionHistory />
    </VCol>
  </VRow>
  
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart";
</style>
