<script setup lang="ts">
const coursesData = [
  { title: 'دوره طراحی پایه فیلم‌برداری', views: '۱.۲k', icon: 'tabler-brand-zoom', color: 'primary' },
  { title: 'دوره مقدماتی توسعه فرانت‌اند', views: '۸۳۴', icon: 'tabler-code', color: 'info' },
  { title: 'مبانی عکاسی', views: '۳.۷k', icon: 'tabler-camera', color: 'success' },
  { title: 'طراحی بصری پیشرفته Dribble', views: '۲.۵k', icon: 'tabler-brand-dribbble', color: 'warning' },
  { title: 'اولین درس آواز شما', views: '۹۴۸', icon: 'tabler-microphone-2', color: 'error' },
]

const moreList = [
  { title: 'Last 28 Days', value: 'Last 28 Days' },
  { title: 'Last Month', value: 'Last Month' },
  { title: 'Last Year', value: 'Last Year' },
]
</script>

<template>
  <VCard>
    <VCardItem :title="$t('academy.topCourses')">
      <template #append>
        <MoreBtn :menu-list="moreList" />
      </template>
    </VCardItem>

    <VCardText>
      <VList class="card-list">
        <VListItem
          v-for="(course, index) in coursesData"
          :key="index"
        >
          <template #prepend>
            <VAvatar
              rounded
              variant="tonal"
              :color="course.color"
              class="me-1"
            >
              <VIcon
                :icon="course.icon"
                size="24"
              />
            </VAvatar>
          </template>

          <template #title>
            <div class="text-h6 clamp-text text-wrap me-4">
              {{ course.title }}
            </div>
          </template>

          <template #append>
            <VChip
              variant="tonal"
              color="secondary"
              size="small"
            >
                {{ course.views }} {{ $t('academy.views') }}
            </VChip>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 24px;
}
</style>
