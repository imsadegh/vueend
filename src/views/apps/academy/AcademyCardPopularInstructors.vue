<script setup lang="ts">
import avatar1 from '@images/avatars/avatar-1.png';
import avatar2 from '@images/avatars/avatar-2.png';
import avatar3 from '@images/avatars/avatar-3.png';
import avatar4 from '@images/avatars/avatar-4.png';

const moreList = [
  { title: 'Refresh', value: 'refresh' },
  { title: 'Update', value: 'update' },
  { title: 'Share', value: 'share' },
]
</script>

<template>
  <VCard>
    <VCardItem :title="$t('academy.Popular Instructors')">
      <template #append>
      <MoreBtn :menu-list="moreList" />
      </template>
    </VCardItem>
    <VDivider />
    <div class="d-flex justify-space-between px-5 py-4">
      <div>{{ $t('academy.Instructors') }}</div>
      <div>{{ $t('academy.Courses') }}</div>
    </div>
    <VDivider />
    <VCardText>
      <VList class="card-list">
        <VListItem
          v-for="instructor in [
            { name: 'علی عباسی', profession: 'هوش تجاری', totalCourses: 33, avatar: avatar1 },
            { name: 'حسین قاسمی', profession: 'دیجیتال مارکتینگ', totalCourses: 52, avatar: avatar2 },
            { name: 'امین ذاکری', profession: 'طراحی رابط/تجربه کاربری', totalCourses: 12, avatar: avatar3 },
            { name: 'سعید طهماسبی', profession: 'Vue', totalCourses: 8, avatar: avatar4 },
          ]"
          :key="instructor.name"
        >
          <template #prepend>
            <VAvatar
              size="34"
              :image="instructor.avatar"
              class="me-1"
            />
          </template>
          <h6 class="text-h6">
            {{ instructor.name }}
          </h6>
          <div class="text-caption text-medium-emphasis">
            {{ instructor.profession }}
          </div>

          <template #append>
            <div class="text-body-1 text-high-emphasis">
              {{ instructor.totalCourses }}
            </div>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 16px;
}
</style>
