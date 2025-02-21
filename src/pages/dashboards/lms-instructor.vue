<script setup lang="ts">
import LmsCongratulationsNorris from '@/views/dashboards/lms/LmsCongratulationsNorris.vue';
import LmsCourseList from '@/views/dashboards/lms/LmsCourseList.vue';

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
    <VCol
      cols="12"
      md="4"
    >
      <LmsCongratulationsNorris />
    </VCol>

    <!-- 👉 Manage Course -->
    <!-- <VCol
      cols="12"
      md="4"
    >
      <LmsCourseUpdate />
    </VCol> -->
    
    <!-- 👉 Course List -->
    <VCol
      cols="12"
      md="8"
    >
      <LmsCourseList />
    </VCol>

    <!-- 👉 User List -->
    <!-- <VCol
      cols="12"
      md="8"
    >
      <LmsUserList />
    </VCol> -->
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart";
</style>
