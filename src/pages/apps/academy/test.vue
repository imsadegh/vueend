<template>
  <div class="video-container">
    <video controls>
      <source :src="videoUrl" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div id="qr-code"></div>
  </div>
</template>

<script setup lang="ts">
import QRCodeStyling from 'qr-code-styling';
import { onMounted } from 'vue';

const videoUrl = "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4";

onMounted(() => {
  const qrCode = new QRCodeStyling({
    width: 150,
    height: 150,
    type: "canvas",
    shape: "square",
    data: "1234567890",
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
        colorStops: [{ offset: 0, color: '#4267b2' }, {  offset: 1, color: '#e9ebee' }]
      },
      type: "extra-rounded",
      roundSize:true
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
});
</script>

<style scoped>
.video-container {
  position: relative;
  inline-size: 640px;
  margin-block: 0;
  margin-inline: auto;
}

video {
  display: block;
  inline-size: 100%;
}

#qr-code {
  position: absolute;
  z-index: 10;
  inset-block-end: 90px;
  inset-inline-end: 10px;
}
</style>
