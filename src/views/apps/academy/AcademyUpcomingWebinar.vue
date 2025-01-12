<script setup lang="ts">
import boyWithTablet from '@images/pages/boy-with-tablet.png'
</script>

<template>
  <VCard>
    <VCardText>
      <div class="d-flex justify-center align-start pb-0 px-3 pt-3 mb-6 bg-light-primary rounded-xl">
        <VImg
          :src="boyWithTablet"
          width="145"
          height="140"
        />
      </div>
      <div>
        <h5 class="text-h5 mb-1">
          {{ $t('academy.upcomingDiscussion') }}
        </h5>
        <div class="text-body-1">
          {{ $t('academy.discussionDescription') }}
        </div>
        <div class="d-flex justify-space-between my-6 gap-4 flex-wrap">
          <div
            v-for="{ icon, title, value } in [
                { icon: 'ri-calendar-line', title: '۱۷ شهریور', value: 'تاریخ' },
                { icon: 'ri-time-line', title: '۳۲ دقیقه', value: 'مدت زمان' }
              ]"
            :key="title"
            class="d-flex gap-x-4 align-center"
          >
            <VAvatar
              color="primary"
              variant="tonal"
              rounded
            >
              <VIcon :icon="icon" />
            </VAvatar>
            <div>
              <div class="text-body-1 text-high-emphasis">
                {{ title }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ value }}
              </div>
            </div>
          </div>
        </div>
        <VBtn block>
            {{ $t('academy.joinEvent') }}
        </VBtn>
      </div>
    </VCardText>
  </VCard>
</template>
