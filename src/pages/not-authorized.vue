<script setup lang="ts">
import { useGenerateImageVariant } from '@/@core/composable/useGenerateImageVariant'
import miscMaskLight from '@images/misc/misc-mask-light.png'
import pages401 from '@images/pages/401.png'

import miscMaskDark from '@images/misc/misc-mask-dark.png'
import miscObj from '@images/pages/misc-401-object.png'

const miscThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)

definePage({
  alias: '/pages/misc/not-authorized',
  meta: {
    layout: 'blank',
    public: true,
  },
})
</script>

<template>
  <div class="misc-wrapper">
    <ErrorHeader
      :status-code="$t('error.401.statusCode')"
      :title="$t('error.401.title')"
      :description="$t('error.401.description')"
      class="mb-10"
    />

    <!-- 👉 Image -->
    <div class="misc-avatar w-100 text-center">
      <VImg
        :src="pages401"
        alt="Coming Soon"
        :height="$vuetify.display.xs ? 400 : 500"
        class="my-sm-5"
      />

      <VBtn
        to="/"
        class="mt-10"
      >
        {{ $t('button.backToHome') }}
      </VBtn>

      <VImg
        :src="miscThemeMask"
        class="d-none d-md-block footer-coming-soon flip-in-rtl"
        cover
      />

      <VImg
        :src="miscObj"
        class="d-none d-md-block footer-coming-soon-obj"
        :max-width="212"
        height="165"
      />
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/misc";
</style>
