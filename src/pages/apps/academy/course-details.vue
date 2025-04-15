<script setup lang="ts">
// import instructorPosterImage from '@images/pages/instructor-poster-image.png'
import LmsAssignmentSubmission from '@/views/dashboards/lms/LmsAssignmentSubmission.vue';
const isSubmissionDialogVisible = ref(false)
const assignments = ref<any[]>([]);
const selectedAssignmentId = ref<number | null>(null);

const token = useCookie('accessToken').value

import { API_BASE_URL } from '@/config/config';
// import { VideoPlayer } from '@videojs-player/vue';
import axios from 'axios';
import QRCodeStyling from 'qr-code-styling';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
const route = useRoute()
const { t: $t } = useI18n()

// import type { CourseDetails } from '@db/apps/academy/types'
// const courseDetails = ref<CourseDetails>()
// const { data, error } = await useApi<CourseDetails>('/apps/academy/course-details')
// if (error.value)
//   console.log(error.value)
// else if (data.value)
//   courseDetails.value = data.value


interface CourseDetails {
  id: number;
  course_name: string;
  about: string;
  description: string;
  skill_level: string;
  total_lectures: number;
  lecture_length: number;
  language: string;
  is_captions: boolean;
  table_of_content: Array<{
    title: string;
    status: string;
    time: string;
    topics: Array<{
      title: string;
      time: string;
      isCompleted: boolean;
    }>;
  }>;
  enrolled_students_count: number;
  discussion_group_url: string;
  instructor_name: string;
  instructor_pfp: string;
}
const courseData = ref<CourseDetails | null>(null)

// Add these lines near the top of your script section:
// const userData = useCookie('userData').value;
// const phoneNumber = ref(userData?.phone_number || '');

const userData = useCookie<any>('userData')
// const phoneNumber = ref(userData.phone_number);

// const videoUrl = "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4";
// const videoOptions = ref({
//   autoplay: false,
//   // poster: instructorPosterImage,
//   controls: true,
//   playsinline: true,
//   PictureInPictureEvent: false,
//   sources: [
//     {
//       src: videoUrl,
//       type: "video/mp4"
//     }
//   ]
// });

// Fetch assignments for the loaded course
const fetchAssignments = async () => {
  try {
    const courseId = route.params.courseId;
    const response = await axios.get(`${API_BASE_URL}/courses/${courseId}/assignments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    assignments.value = response.data; // Expecting an array of assignments
  } catch (error) {
    // console.error("Error fetching assignments:", error.response?.data || error.message);
    console.error("Error fetching assignments:", (error as any).response?.data || (error as any).message);
  }
};

const localizedSkillLevel = computed(() => {
  if (!courseData.value || !courseData.value.skill_level) return '';
  const level = courseData.value.skill_level.toLowerCase();
  switch (level) {
    case 'beginner':
      return $t('academy.beginner');
    case 'intermediate':
      return $t('academy.intermediate');
    case 'advanced':
      return $t('academy.advanced');
    default:
      return courseData.value.skill_level;
  }
});

const panelStatus = ref(0)

const openSubmissionDialog = (assignmentId: number) => {
  selectedAssignmentId.value = assignmentId;
  isSubmissionDialogVisible.value = true;
};


const modules = ref<any[]>([])
const isVideoDialogVisible = ref(false)
const selectedVideoModule = ref<any>(null)
const isArticleDialogVisible = ref(false)
const selectedArticleModule = ref<any>(null)

let player: videojs.Player | null = null;
const videoElementRef = ref<HTMLVideoElement | null>(null);

watch(isVideoDialogVisible, (visible) => {
  if (visible) {
    nextTick(() => {
      if (videoElementRef.value && selectedVideoModule.value) {
        player = videojs(videoElementRef.value, {
          autoplay: false,
          controls: true,
          playsinline: true,
          sources: [{ src: selectedVideoModule.value.content_url, type: 'video/mp4' }],
          width: 1280,
          height: 720
        });
        player.ready(() => {
          const key = `video_current_time_${selectedVideoModule.value.id}`;
          const savedTime = localStorage.getItem(key);
          if (savedTime) {
            player!.currentTime(parseFloat(savedTime));
          }
          player!.on('timeupdate', () => {
            localStorage.setItem(key, player!.currentTime().toString());
          });
        });
      }
    });
  } else {
    if (player) {
      player.dispose();
      player = null;
    }
  }
});

onBeforeUnmount(() => {
  if (player) {
    player.dispose();
    player = null;
  }
});


const fetchModules = async () => {
  try {
    const courseId = route.params.courseId
    const response = await axios.get(`${API_BASE_URL}/courses/${courseId}/modules`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    modules.value = response.data
  } catch (error) {
    console.error("Error fetching modules:", (error as any).response?.data || (error as any).message)
  }
}

const videoModules = computed(() => modules.value.filter(m => m.type === 'video' && m.visible))
const articleModules = computed(() => modules.value.filter(m => m.type === 'article' && m.visible))

function getVideoOptions(module: any) {
  // Dynamic height based on display (adjust if needed)
  return {
    autoplay: false,
    controls: true,
    playsinline: true,
    sources: [
      { src: module.content_url, type: 'video/mp4' }
    ],
    width: 1280,
    height: 720,
  }
}

function openVideoDialog(module: any) {
  selectedVideoModule.value = module
  isVideoDialogVisible.value = true
}
function openArticleDialog(module: any) {
  selectedArticleModule.value = module
  isArticleDialogVisible.value = true
}

const openDiscussionGroup = () => {
  if (courseData.value?.discussion_group_url) {
    window.open(courseData.value.discussion_group_url, '_blank');
  }
};

onMounted(async () => {
  try {
    const courseId = route.params.courseId
    const token = useCookie('accessToken').value
    const response = await axios.get(`${API_BASE_URL}/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    courseData.value = response.data
  } catch (err) {
    console.error('Error fetching course details:', err)
  }

  const qrCode = new QRCodeStyling({
    width: 150,
    height: 150,
    type: "canvas",
    shape: "square",
    data: userData.value?.phone_number || '',
    margin: 5,
    qrOptions: {
      typeNumber: 0,
      mode: "Numeric",
      errorCorrectionLevel: "H"
    },
    // image: "/src/assets/images/avatars/avatar-3.png",
    // imageOptions: {
    //   hideBackgroundDots: true,
    //   imageSize: 33,
    //   margin: 4,
    //   crossOrigin: "anonymous",
    //   saveAsBlob: true
    // },
    dotsOptions: {
      color: "#4267b2",
      gradient: {
        type: "linear",
        rotation: 45,
        colorStops: [{ offset: 0, color: '#4267b2' }, { offset: 1, color: '#e9ebee' }]
      },
      type: "extra-rounded",
      roundSize: true
    },
    cornersSquareOptions: {
      color: "#4267b2",
      // gradient: 
      // type: "dot"
    },
    cornersDotOptions: {
      color: "#4267b2",
      // gradient: {
      //   type: "radial",
      //   colorStops: [{ offset: 0, color: "#e9ebee" }, { offset: 1, color: "#e9ebee" }]
      // }
      type: "dot"
    },
    backgroundOptions: {
      // color: "#e9ebee",
      color: "transparent",
      // gradient:
    },

  });
  const container = document.getElementById("qr-code");
  if (container) {
    qrCode.append(container);
  }

  fetchAssignments();
  
  // fetchCourseDetails() // if still needed
  fetchModules()
})

// onMounted(() => {
// });

</script>

<template>
  <VRow>
    <VCol cols="12" md="8">
      <VCard>
        <VCardItem title="دوره آموزشی" class="pb-6">
          <template #subtitle>
            <div class="text-body-1">
              <span class="text-h6 d-inline-block">{{ courseData?.course_name }}</span>
            </div>
          </template>
          <!-- <template #append>
            <div class="d-flex gap-4 align-center">
              <VChip variant="tonal" color="error" size="small">
                رابط کاربری/تجربه کاربری
              </VChip>
              <VIcon size="24" class="cursor-pointer" icon="ri-share-forward-line" />
              <VIcon size="24" class="cursor-pointer" icon="ri-bookmark-line" />
            </div>
          </template> -->
        </VCardItem>

        <VCardText>
          <VCard flat border>
            <div class="px-2 pt-2 video-container">
              <!-- <VideoPlayer src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4"
              :poster="instructorPosterImage" controls plays-inline :height="$vuetify.display.mdAndUp ? 440 : 250"
              class="w-100 rounded" /> -->
              <!-- <VideoPlayer class="w-100 rounded" :options="videoOptions" :height="$vuetify.display.mdAndUp ? 440 : 250" /> -->
              <div id="qr-code"></div>
            </div>

            <div style="margin: 16px;">
              <!-- Video Modules Section -->
              <VRow v-if="videoModules.length">
                <VCol cols="12">
                  <h3>{{ $t('course.videoModules') }}</h3>
                </VCol>
                <VCol v-for="module in videoModules" :key="module.id" cols="24" md="4">
                  <VCard class="mb-4" style="cursor: pointer;">
                    <VCardTitle class="mt-1 pb-3">
                      {{ module.title }}
                    </VCardTitle>
                    <VCardText class="d-flex justify-center">
                      <!-- <VCardActions class="d-flex justify-center"> -->

                      <!-- <div>{{ module.description }}</div> -->
                      <VBtn variant="tonal" color="primary" @click="openVideoDialog(module)">
                        {{ $t('course.viewVideo') }}
                      </VBtn>
                      <!-- </VCardActions> -->
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>

              <VDialog v-model="isVideoDialogVisible" max-width="90vw">
                <VCard>
                  <VCardTitle>{{ selectedVideoModule?.title }}</VCardTitle>
                  <VCardText>
                    <div v-if="selectedVideoModule">
                      <p>{{ selectedVideoModule.description }}</p>
                      <video ref="videoElementRef" class="video-js vjs-default-skin w-100"></video>
                    </div>
                  </VCardText>
                  <VCardActions>
                    <VBtn color="primary" @click="isVideoDialogVisible = false">{{ $t('button.close') }}</VBtn>
                  </VCardActions>
                </VCard>
              </VDialog>

              <VDivider class="my-4" />

              <!-- Article Modules Section -->
              <VRow v-if="articleModules.length">
                <VCol cols="12">
                  <h3>{{ $t('course.articleModules') }}</h3>
                </VCol>
                <VCol v-for="module in articleModules" :key="module.id" cols="24" md="4">
                  <VCard class="mb-4" style="cursor: pointer;">
                    <VCardTitle class="mt-1 pb-3">
                      {{ module.title }}
                    </VCardTitle>
                    <VCardText class="d-flex justify-center">
                      <!-- <VCardActions class="d-flex justify-center"> -->
                      <!-- <div v-else-if="module.content_url">
                        {{ $t('course.readArticle') }}
                        </div> -->
                      <!-- <div v-if="module.module_data">
                          {{ module.module_data }}
                        </div> -->
                      <VBtn variant="tonal" color="primary" @click="openArticleDialog(module)">
                        {{ $t('course.readArticle') }}
                      </VBtn>
                      <!-- </VCardActions> -->
                    </VCardText>
                  </VCard>
                </VCol>

                <VDialog v-model="isArticleDialogVisible" max-width="800">
                  <VCard>
                    <VCardTitle>{{ selectedArticleModule?.title }}</VCardTitle>
                    <VCardText>
                      <div v-if="selectedArticleModule?.type === 'article'">
                        <div v-if="selectedArticleModule?.description" class="mb-3">
                          <h4>توضیحات</h4>
                          <p>{{ selectedArticleModule.description }}</p>
                        </div>
                        <div>
                          <h4>متن</h4>
                          <div v-html="selectedArticleModule?.article_content"></div>
                        </div>
                      </div>
                      <div v-else>
                        <!-- Fallback for non-article modules (e.g., video) -->
                        <iframe :src="selectedArticleModule?.content_url" style=" block-size: 600px;inline-size: 100%;"
                          frameborder="0"></iframe>
                      </div>
                    </VCardText>
                    <VCardActions>
                      <VBtn color="primary" @click="isArticleDialogVisible = false">{{ $t('button.close') }}</VBtn>
                    </VCardActions>
                  </VCard>
                </VDialog>
              </VRow>
            </div>

            <VDivider class="my-7" :thickness="3" />

            <VCardText>
              <h5 class="text-h5 mb-4">
                {{ $t('academy.aboutThisCourse') }}
              </h5>
              <p class="text-body-1">
                {{ courseData?.about }}
              </p>

              <VDivider class="my-6" />
              <h5 class="text-h5 mb-4">
                {{ $t('academy.byTheNumbers') }}
              </h5>

              <!-- some details -->
              <div class="d-flex gap-x-12 gap-y-5 flex-wrap">
                <div>
                  <VList class="card-list text-medium-emphasis">

                    <VListItem>
                      <template #prepend>
                        <VIcon icon="ri-check-line" size="20" class="me-n1" />
                      </template>
                      <VListItemTitle>{{ $t('academy.Skill Level') }}: {{ localizedSkillLevel }}</VListItemTitle>
                    </VListItem>

                    <VListItem>
                      <template #prepend>
                        <VIcon icon="ri-group-line" size="20" class="me-n1" />
                      </template>
                      <VListItemTitle>{{ $t('academy.Students') }}: {{ courseData?.enrolled_students_count }}
                      </VListItemTitle>
                    </VListItem>

                    <!-- language -->
                    <VListItem>
                      <template #prepend>
                        <VIcon icon="ri-global-line" size="20" class="me-n1" />
                      </template>
                      <VListItemTitle>
                        {{ $t('academy.Languages') }}:
                        {{ courseData?.language === 'fa' ? $t('farsi') : courseData?.language }}
                      </VListItemTitle>
                    </VListItem>

                    <!-- caption -->
                    <VListItem>
                      <template #prepend>
                        <VIcon icon="ri-pages-line" size="20" class="me-n1" />
                      </template>
                      <VListItemTitle>
                        {{ $t('academy.Captions') }}:
                        {{
                          courseData?.is_captions
                            ? $t('true')
                            : $t('false')
                        }}
                      </VListItemTitle>
                    </VListItem>

                  </VList>
                </div>

                <div>
                  <VList class="card-list text-medium-emphasis">

                    <VListItem>
                      <template #prepend>
                        <VIcon icon="ri-video-upload-line" size="20" class="me-n1" />
                      </template>
                      <VListItemTitle>{{ $t('academy.Lectures') }}: {{ courseData?.total_lectures }}</VListItemTitle>
                    </VListItem>

                    <VListItem>
                      <template #prepend>
                        <VIcon icon="ri-time-line" size="20" class="me-n1" />
                      </template>
                      <VListItemTitle>{{ $t('academy.Video') }}: {{ courseData?.lecture_length }} {{
                        $t('academy.minute') }}
                      </VListItemTitle>
                    </VListItem>

                  </VList>
                </div>
              </div>
              <VDivider class="my-6" />

              <h5 class="text-h5 mb-4">
                {{ $t('academy.Description') }}
              </h5>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div v-html="courseData?.description" />

              <VDivider class="my-6" />
              <h5 class="text-h5 mb-4">
                {{ $t('academy.Instructor') }}
              </h5>
              <div class="d-flex align-center">
                <VAvatar :image="courseData?.instructor_pfp" size="38" class="me-4" />
                <div>
                  <h6 class="text-h6 mb-1">
                    {{ courseData?.instructor_name }}
                  </h6>
                  <div class="text-body-2">
                    <!-- {{ courseDetails?.instructorPosition }} -->
                  </div>
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCardText>
      </VCard>
    </VCol>

    <!-- Table of content -->
    <VCol cols="12" md="4">
      <div class="course-content">
        <VExpansionPanels v-model="panelStatus" variant="accordion">
          <VExpansionPanel v-for="(section, index) in courseData?.table_of_content" :key="index" elevation="0"
            collapse-icon="ri-arrow-down-s-line"
            :expand-icon="$vuetify.locale.isRtl ? 'ri-arrow-left-s-line' : 'ri-arrow-right-s-line'" :value="index">
            <template #title>
              <div>
                <h5 class="text-h5">
                  {{ section.title }}
                </h5>
                <div class="text-body-1">
                  {{ section.status }} | {{ section.time }}
                </div>
              </div>
            </template>

            <template #text>
              <VList class="card-list">
                <VListItem v-for="(topic, id) in section.topics" :key="id">
                  <template #prepend>
                    <VCheckbox :model-value="topic.isCompleted" class="me-3" />
                  </template>
                  <VListItemTitle>
                    <h6 class="text-h6">
                      {{ topic.title }}
                    </h6>
                  </VListItemTitle>
                  <VListItemSubtitle>
                    <div class="text-body-2">
                      {{ topic.time }}
                    </div>
                  </VListItemSubtitle>
                </VListItem>
              </VList>
            </template>
          </VExpansionPanel>
        </VExpansionPanels>
      </div>

      <div class="course-assignment">
        <VCard class="mt-6">
          <VCardTitle class="pb-3">
            <h3>{{ $t('assignment.myAssignments') }}</h3>
          </VCardTitle>
          <VCardText>
            <VList>
              <VListItem v-for="assignment in assignments" :key="assignment.id">
                <div>
                  <VListItemTitle>{{ assignment.title }}</VListItemTitle>
                  <!-- <VListItemSubtitle>{{ assignment.description }}</VListItemSubtitle> -->
              </div>
                <template #append>
                  <VBtn variant="tonal" color="primary" @click="openSubmissionDialog(assignment.id)"
                  :disabled="!!assignment.feedback">
                    {{ assignment.feedback ? $t('assignment.reviewed') : $t('academy.view')  }}
                  </VBtn>
                </template>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>
      </div>

      <VDialog v-model="isSubmissionDialogVisible" max-width="600">
        <LmsAssignmentSubmission :assignmentId="selectedAssignmentId ?? ''" />
      </VDialog>


      <div class="course-disscussiongroup">
        <VCard class="mt-6">
          <VCardTitle class="pb-3">
            <h3>{{ $t('course.discussionGroup') }}</h3>
          </VCardTitle>

          <VCardText>
            <p class="text-body-1">
              برای مشاهده گروه درسی ایتا کلیک کنید.
            </p>
          </VCardText>

          <VCardActions class="d-flex justify-center">
            <!-- <div class="d-flex justify-center"> -->
            <VBtn variant="tonal" color="primary" :disabled="!courseData?.discussion_group_url"
              @click="openDiscussionGroup">
              {{ $t('academy.join') }}
            </VBtn>
            <!-- </div> -->
          </VCardActions>

        </VCard>
      </div>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 8px;
}

.course-content {
  /* position: sticky; */
  inset-block: 4rem 0;

  .card-list {
    --v-card-list-gap: 1rem;
  }
}

.course-assignment {
  /* position: sticky; */
  inset-block-start: calc(4rem + 1rem);

  /* Adjust to match spacing */
  margin-block-start: 1rem;

  .v-card {
    padding: 7px;
    border-radius: 10px;

    /* background-color: rgba(var(--v-primary-container), var(--v-primary-container-opacity));
    color: rgba(var(--v-primary), var(--v-primary-opacity)); */
  }
}

.course-disscussiongroup {
  position: sticky;
  inset-block-start: calc(4rem + 1rem);

  /* Adjust to match spacing */
  margin-block-start: 1rem;

  .v-card {
    padding: 7px;
    border-radius: 10px;
  }
}

.video-container {
  position: relative;

  /* inline-size: 640px; Adjust inline size as needed */
  margin-block: 0;
  margin-inline: auto;
}

/* .video-player {
  inline-size: 100%;
} */

#qr-code {
  position: absolute;
  z-index: 10;
  inset-block-end: 90px;
  inset-inline-end: 10px;
}
</style>

<style lang="scss">
.course-content {
  .v-expansion-panels {
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    border-radius: 10px;

    .v-expansion-panel {
      &--active {
        .v-expansion-panel-title--active {
          border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));

          .v-expansion-panel-title__overlay {
            opacity: var(--v-hover-opacity) !important;
          }
        }
      }

      .v-expansion-panel-title {
        .v-expansion-panel-title__overlay {
          background-color: rgba(var(--v-theme-on-surface));
          opacity: var(--v-hover-opacity);
        }

        &:hover {
          .v-expansion-panel-title__overlay {
            opacity: var(--v-hover-opacity) !important;
          }
        }

        &__icon {
          .v-icon {
            block-size: 1.5rem;
            color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
            font-size: 1.5rem;
            inline-size: 1.5rem;
          }
        }
      }

      .v-expansion-panel-text {
        &__wrapper {
          padding-block: 1rem;
          padding-inline: 0.75rem;
        }
      }
    }
  }
}

/* .course-assignment {
  .v-card {
    padding: 1rem;
    border-radius: 10px;
    background-color: rgba(var(--v-primary-container), var(--v-primary-container-opacity));
    color: rgba(var(--v-primary), var(--v-primary-opacity));

    .v-card-item {
      border-radius: 10px;
      background-color: rgba(var(--v-primary), var(--v-primary-opacity));
      color: rgba(var(--v-primary), var(--v-primary-opacity));
      padding-block: 0.5rem;
      padding-inline: 1rem;
    }
  }
} */
</style>
