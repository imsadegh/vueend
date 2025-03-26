<script setup lang="ts">
// import AcademyMyCourses from '@/views/apps/academy/AcademyMyCourses.vue'
import AcademyMyCourses from '@/views/dashboards/lms/LmsMyCourses.vue'
import academyCourseIllustration1 from '@images/pages/academy-course-illustration1.png'
import academyCourseIllustration2Dark from '@images/pages/academy-course-illustration2-dark.png'
import academyCourseIllustration2Light from '@images/pages/academy-course-illustration2-light.png'
import boyAcademyIllustration from '@images/pages/boy-academy-illustration.png'
import girlAcademyIllustration from '@images/pages/girl-academy-illustration.png'

const searchQuery = ref('')

const academyCourseIllustration2 = useGenerateImageVariant(academyCourseIllustration2Light, academyCourseIllustration2Dark)
</script>

<template>
  <div>

    <!-- search card -->
    <VCard class="mb-6">
      <VCardText class="py-12 position-relative">
        <div class="d-flex flex-column gap-y-4 mx-auto" :class="$vuetify.display.mdAndUp ? 'w-50' : 'w-100'">
          <h4 class="text-h4 text-center text-wrap mx-auto" :class="$vuetify.display.mdAndUp ? 'w-75' : 'w-100'">
            {{ $t('academy.educationTalentsCareer') }} <span class="text-primary">{{ $t('academy.allInOnePlace')
              }}</span>
          </h4>
          <p class="text-center text-wrap text-body-1 mx-auto mb-0">
            {{ $t('academy.growYourSkill') }}
          </p>
          <div class="d-flex justify-center align-center gap-x-4">
            <!-- TODO active the search box -->
            <VTextField v-model="searchQuery" density="compact" :placeholder="$t('academy.findYourCourse')"
              style="max-inline-size: 318px;" />
            <VBtn color="primary" icon="ri-search-line" class="rounded" />
          </div>
        </div>
        <img :src="academyCourseIllustration1" class="illustration1 d-none d-md-block flip-in-rtl" height="180">
        <img :src="academyCourseIllustration2" class="illustration2 d-none d-md-block" height="124">
      </VCardText>
    </VCard>

    <AcademyMyCourses :search-query="searchQuery" />

    <!-- earnCertificate and best courses card -->
    <div class="mb-6">
      <VRow>
        <VCol cols="12" md="6">
          <VCard flat color="rgba(var(--v-theme-info), 0.08)">
            <VCardText>
              <div class="d-flex flex-column-reverse flex-sm-row gap-4 justify-space-between">
                <div class="text-center text-sm-start">
                  <h5 class="text-h5 text-info mb-2">
                    {{ $t('academy.earnCertificate') }}
                  </h5>
                  <p class="text-body-1 text-high-emphasis mb-4">
                    {{ $t('academy.getRightCertificateProgram') }}
                  </p>
                  <VBtn color="info" size="small">
                    {{ $t('academy.viewPrograms') }}
                  </VBtn>
                </div>

                <div class="text-center">
                  <img :src="boyAcademyIllustration">
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCol>

        <VCol cols="12" md="6">
          <VCard flat color="rgba(var(--v-theme-error), 0.08)">
            <VCardText>
              <div class="d-flex flex-column-reverse flex-sm-row gap-4 justify-space-between">
                <div class="text-center text-sm-start">
                  <h5 class="text-h5 text-error mb-2">
                    {{ $t('academy.bestRatedCourses') }}
                  </h5>
                  <p class="text-body-1 text-high-emphasis text-wrap mb-4">
                    {{ $t('academy.enrollNowInPopularCourses') }}
                  </p>
                  <VBtn color="error" size="small">
                    {{ $t('academy.viewCourses') }}
                  </VBtn>
                </div>

                <div class="text-center">
                  <img :src="girlAcademyIllustration">
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>

    <!-- todaysFreeCourses -->
    <!-- <VCard>
      <VCardText>
        <VRow>
          <VCol cols="12" md="4">
            <div class="d-flex flex-column align-center gap-y-4 h-100 justify-center">
              <VAvatar variant="tonal" size="52" rounded color="primary">
                <VIcon icon="ri-gift-line" size="36" />
              </VAvatar>
              <h4 class="text-h4">
                {{ $t('academy.todaysFreeCourses') }}
              </h4>
              <p class="text-body-1 text-center mb-0">
                {{ $t('academy.freeCoursesDescription') }}
              </p>
              <VBtn>{{ $t('academy.getPremiumCourses') }}</VBtn>
            </div>
          </VCol>

          <VCol cols="12" md="4" sm="6">
            <VCard flat border>
              <div class="pa-2">
                <VideoPlayer src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4"
                  :poster="singingCoursePoster" controls plays-inline :height="$vuetify.display.mdAndUp ? 200 : 150"
                  class="w-100 rounded" />
              </div>
              <VCardText class="pt-3">
                <h5 class="text-h5 mb-2">
                  Your First Singing Lesson
                </h5>
                <p class="text-body-1 mb-0">
                  In the same way as any other artistic domain, singing lends itself perfectly to self-teaching.
                </p>
              </VCardText>
            </VCard>
          </VCol>

          <VCol cols="12" md="4" sm="6">
            <VCard flat border>
              <div class="pa-2">
                <VideoPlayer src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4"
                  :poster="guitarCoursePoster" controls plays-inline :height="$vuetify.display.mdAndUp ? 200 : 150"
                  class="w-100 rounded" />
              </div>
              <VCardText class="pt-3">
                <h5 class="text-h5 mb-2">
                  Guitar for Beginners
                </h5>
                <p class="text-body-1 mb-0">
                  The Fender Acoustic Guitar is best choice for beginners and professionals.
                </p>
              </VCardText>
            </VCard>
          </VCol>

        </VRow>
      </VCardText>
    </VCard> -->
    
  </div>
</template>

<style lang="scss">
@import "video.js/dist/video-js.css";

.illustration1 {
  position: absolute;
  inset-block-end: 0;
  inset-inline-end: 0;
}

.illustration2 {
  position: absolute;
  inset-block-start: 3rem;
  inset-inline-start: 3rem;
}
</style>
