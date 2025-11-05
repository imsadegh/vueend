<template>
  <div class="video-management">
    <!-- Instructor: Add/Edit Video Form -->
    <div v-if="isInstructor" class="video-form-section mb-6">
      <v-card>
        <v-card-title>{{ $t('video.addVideoTitle') }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitVideo">
            <v-text-field
              v-model="videoForm.video_url"
              label="Video URL"
              type="url"
              placeholder="https://example.com/video.mp4"
              required
              :hint="$t('video.urlHint')"
              class="mb-4"
            />

            <v-text-field
              v-model="videoForm.video_title"
              label="Video Title"
              required
              class="mb-4"
            />

            <v-text-field
              v-model.number="videoForm.estimated_duration_seconds"
              label="Duration (seconds)"
              type="number"
              required
              class="mb-4"
            />

            <v-select
              v-model="videoForm.video_source"
              :items="videoSources"
              label="Video Source"
              class="mb-4"
            />

            <v-btn
              type="submit"
              color="primary"
              :loading="isSubmitting"
              :disabled="!isFormValid"
            >
              {{ hasVideo ? $t('video.updateVideo') : $t('video.addVideo') }}
            </v-btn>

            <v-btn
              v-if="hasVideo"
              @click="deleteVideo"
              color="error"
              variant="outlined"
              class="ms-2"
              :loading="isDeleting"
            >
              {{ $t('video.deleteVideo') }}
            </v-btn>
          </v-form>

          <v-alert
            v-if="successMessage"
            type="success"
            class="mt-4"
            dismissible
          >
            {{ successMessage }}
          </v-alert>

          <v-alert
            v-if="errorMessage"
            type="error"
            class="mt-4"
            dismissible
          >
            {{ errorMessage }}
          </v-alert>
        </v-card-text>
      </v-card>
    </div>

    <!-- Student: Watch Button -->
    <div v-if="!isInstructor && hasVideo" class="video-watch-section mb-6">
      <v-card>
        <v-card-title>{{ $t('video.watchVideo') }}</v-card-title>
        <v-card-text>
          <p class="mb-4">{{ videoForm.video_title }}</p>
          <p class="text-caption mb-4">
            {{ formatDuration(videoForm.estimated_duration_seconds) }}
          </p>

          <v-btn
            @click="requestStreamToken"
            color="primary"
            :loading="isRequestingToken"
          >
            {{ $t('video.watchOnApp') }}
          </v-btn>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import videoService from '@/services/videoService'

interface Props {
  courseId: number
  moduleId: number
  isInstructor: boolean
  token: string
}

const props = defineProps<Props>()

const { t: $t } = useI18n()

const videoForm = ref({
  video_url: '',
  video_title: '',
  estimated_duration_seconds: 0,
  video_source: 'external',
})

const videoSources = [
  { title: 'External', value: 'external' },
  { title: 'YouTube', value: 'youtube' },
  { title: 'Vimeo', value: 'vimeo' },
]

const hasVideo = ref(false)
const isSubmitting = ref(false)
const isDeleting = ref(false)
const isRequestingToken = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const isFormValid = computed(() => {
  return (
    videoForm.value.video_url &&
    videoForm.value.video_title &&
    videoForm.value.estimated_duration_seconds > 0
  )
})

const submitVideo = async () => {
  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    let result

    if (hasVideo.value) {
      result = await videoService.updateVideo(
        props.courseId,
        props.moduleId,
        videoForm.value,
        props.token
      )
    } else {
      result = await videoService.addVideo(
        props.courseId,
        props.moduleId,
        videoForm.value,
        props.token
      )
    }

    if (result.success) {
      successMessage.value = hasVideo.value
        ? $t('video.updateSuccess')
        : $t('video.addSuccess')
      hasVideo.value = true
    } else {
      errorMessage.value = result.error
    }
  } catch (error: any) {
    errorMessage.value = $t('video.submissionError')
  } finally {
    isSubmitting.value = false
  }
}

const deleteVideo = async () => {
  if (!confirm($t('video.confirmDelete'))) return

  isDeleting.value = true
  errorMessage.value = ''

  try {
    const result = await videoService.deleteVideo(
      props.courseId,
      props.moduleId,
      props.token
    )

    if (result.success) {
      successMessage.value = $t('video.deleteSuccess')
      hasVideo.value = false
      videoForm.value = {
        video_url: '',
        video_title: '',
        estimated_duration_seconds: 0,
        video_source: 'external',
      }
    } else {
      errorMessage.value = result.error
    }
  } catch (error: any) {
    errorMessage.value = $t('video.deleteError')
  } finally {
    isDeleting.value = false
  }
}

const requestStreamToken = async () => {
  isRequestingToken.value = true

  try {
    const streamToken = await videoService.getStreamToken(
      props.courseId,
      props.moduleId,
      props.token
    )

    if (streamToken) {
      // In Phase 2, this will be replaced with deep linking to the mobile app
      // For now, construct the proxy URL and open it
      const proxyUrl = videoService.getVideoProxyUrl(streamToken.stream_token)
      window.open(proxyUrl, '_blank')
    } else {
      errorMessage.value = $t('video.tokenError')
    }
  } catch (error: any) {
    errorMessage.value = $t('video.tokenError')
  } finally {
    isRequestingToken.value = false
  }
}

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  }
  return `${minutes}m ${secs}s`
}

// Load video data if it exists
onMounted(() => {
  // This would typically load from the module data if it already has a video
  // For now, we assume the parent component will pass this data
})
</script>

<style scoped>
.video-management {
  width: 100%;
}

.video-form-section,
.video-watch-section {
  width: 100%;
}
</style>
