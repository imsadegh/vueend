<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const borderColor = 'rgba(var(--v-border-color), var(--v-border-opacity))'

// Topics Charts config
const topicsChartConfig = {
  chart: {
    height: 270,
    type: 'bar',
    toolbar: {
      show: false,
    },
  },

  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '70%',
      distributed: true,
      borderRadius: 7,
      borderRadiusApplication: 'end',
    },
  },

  colors: [
    'rgba(var(--v-theme-primary),1)', 'rgba(var(--v-theme-info),1)', 'rgba(var(--v-theme-success),1)', 'rgba(var(--v-theme-secondary),1)', 'rgba(var(--v-theme-error),1)', 'rgba(var(--v-theme-warning),1)',
  ],

  grid: {
    borderColor,
    strokeDashArray: 10,
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
    padding: {
      top: -35,
      bottom: -12,
    },
  },

  dataLabels: {
    enabled: true,
    style: {
      colors: ['#fff'],
      fontWeight: 500,
      fontSize: '13px',

    },
    offsetX: 0,
    dropShadow: {
      enabled: false,
    },
    formatter(val: string, opt: any) {
      return topicsChartConfig.labels[opt.dataPointIndex]
    },
  },
  // TODO fetch the courses from the api
  labels: [
    $t('topics.uiDesign'), 
    $t('topics.uxDesign'), 
    $t('topics.music'), 
    $t('topics.animation'), 
    $t('topics.vue'), 
    $t('topics.seo')
  ],

  xaxis: {
    categories: ['6', '5', '4', '3', '2', '1'],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        colors: 'rgba(var(--v-theme-on-background), var(--v-disabled-opacity))',
        fontSize: '13px',
      },
      formatter(val: string) {
        return `${val}%`
      },
    },
  },

  yaxis: {
    max: 35,
    labels: {
      style: {
        colors: 'rgba(var(--v-theme-on-background), var(--v-disabled-opacity))',
        fontSize: '13px',
      },
    },
  },

  tooltip: {
    enabled: true,
    style: {
      fontSize: '12px',
    },
    onDatasetHover: {
      highlightDataSeries: false,
    },
  },
  legend: {
    show: false,
  },

}

const topicsChartSeries = [
  {
    data: [35, 20, 14, 12, 10, 9],
  },
]

const topicsData = [
  { title: $t('topics.uiDesign'), value: 35, color: 'primary' },
  { title: $t('topics.uxDesign'), value: 20, color: 'info' },
  { title: $t('topics.music'), value: 14, color: 'success' },
]

const moreTopics = [
  { title: $t('topics.animation'), value: 12, color: 'secondary' },
  { title: $t('topics.vue'), value: 10, color: 'error' },
  { title: $t('topics.seo'), value: 9, color: 'warning' },
]

const moreList = [
  { title: $t('actions.refresh'), value: 'refresh' },
  { title: $t('actions.update'), value: 'update' },
  { title: $t('actions.share'), value: 'share' },
]
</script>

<template>
  <VCard>
    <VCardItem :title="$t('academy.interestedIn')">
      <template #append>
        <MoreBtn :menu-list="moreList" />
      </template>
    </VCardItem>

    <VCardText>
      <VRow>
        <VCol
          cols="12"
          sm="6"
        >
          <VueApexCharts
            type="bar"
            height="268"
            :options="topicsChartConfig"
            :series="topicsChartSeries"
            class="mb-md-0 mb-6"
          />
        </VCol>

        <VCol class="d-flex justify-space-around align-start">
          <div class="d-flex flex-column gap-y-12">
            <div
              v-for="topic in topicsData"
              :key="topic.title"
              class="d-flex gap-x-2"
            >
              <VIcon
                icon="ri-circle-fill"
                :color="topic.color"
                size="12"
                class="mt-1"
              />
              <div>
                <div
                  class="text-body-1"
                  style="min-inline-size: 90px;"
                >
                  {{ topic.title }}
                </div>
                <h5 class="text-h5">
                  {{ topic.value }}%
                </h5>
              </div>
            </div>
          </div>

          <div class="d-flex flex-column gap-y-12">
            <div
              v-for="topic in moreTopics"
              :key="topic.title"
              class="d-flex gap-x-2"
            >
              <VIcon
                icon="ri-circle-fill"
                :color="topic.color"
                size="12"
                class="mt-1"
              />
              <div>
                <div
                  class="text-body-1"
                  style="min-inline-size: 90px;"
                >
                  {{ topic.title }}
                </div>
                <h5 class="text-h5">
                  {{ topic.value }}%
                </h5>
              </div>
            </div>
          </div>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
