<template>
  <div>
    <!-- Video element with video.js classes -->
    <!-- <video 
      ref="videoPlayer" 
      class="video-js vjs-default-skin" 
      controls 
      preload="auto" 
      width="600">
      <source 
        src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
        type="video/mp4" />
      Your browser does not support the video tag.
    </video> -->

    <VAlert type="info" variant="outlined" class="mx-auto" style="max-inline-size: 600px;" :title="$t('exam.finished')"
      close-label="Close Alert" closable>

      <!-- <span>{{ $t('exam.finished') }}</span> -->
      <!-- <VBtn variant="tonal">
        {{ $t('button.close') }}
      </VBtn> -->
    </VAlert>



  </div>
</template>

<script setup lang="ts">
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const videoPlayer = ref<HTMLVideoElement | null>(null);
let player: videojs.Player | null = null;
const LOCAL_STORAGE_KEY = 'video-current-time';

// Save the current playback time in localStorage.
const saveCurrentTime = () => {
  if (player) {
    localStorage.setItem(LOCAL_STORAGE_KEY, player.currentTime().toString());
  }
};

onMounted(() => {
  if (videoPlayer.value) {
    // Initialize the video.js player instance.
    player = videojs(videoPlayer.value, {
      controls: true,
      autoplay: false,
      preload: 'auto'
    });

    // When the player is ready, restore the saved playback time.
    player.ready(() => {
      const savedTime = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedTime) {
        player!.currentTime(parseFloat(savedTime));
      }
    });

    // Save the playback time if the user closes or reloads the page.
    window.addEventListener('beforeunload', saveCurrentTime);
  }
});

onBeforeUnmount(() => {
  // Save the current playback time and remove event listeners before unmounting.
  saveCurrentTime();
  window.removeEventListener('beforeunload', saveCurrentTime);
  if (player) {
    player.dispose();
    player = null;
  }
});
</script>

<style scoped>
/* Center the video element */
.video-js {
  display: block;
  margin-block: 0;
  margin-inline: auto;
}
</style>
