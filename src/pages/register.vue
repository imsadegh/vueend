<script setup lang="ts">
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import authV2RegisterIllustrationBorderedDark from '@images/pages/auth-v2-register-illustration-bordered-dark.png'
import authV2RegisterIllustrationBorderedLight from '@images/pages/auth-v2-register-illustration-bordered-light.png'
import authV2RegisterIllustrationDark from '@images/pages/auth-v2-register-illustration-dark.png'
import authV2RegisterIllustrationLight from '@images/pages/auth-v2-register-illustration-light.png'
import authV2RegisterMaskDark from '@images/pages/auth-v2-register-mask-dark.png'
import authV2RegisterMaskLight from '@images/pages/auth-v2-register-mask-light.png'

import { API_BASE_URL } from '@/config/config'
import axios from 'axios'; // Axios for API requests
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const authThemeMask = useGenerateImageVariant(authV2RegisterMaskLight, authV2RegisterMaskDark)

const authThemeImg = useGenerateImageVariant(
  authV2RegisterIllustrationLight,
  authV2RegisterIllustrationDark,
  authV2RegisterIllustrationBorderedLight,
  authV2RegisterIllustrationBorderedDark,
  true)

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const form = ref({
  username: '',
  email: '',
  password: '',
  privacyPolicies: false,
  role: '', // Add role
})

const isPasswordVisible = ref(false)

const router = useRouter()
const { t: $t } = useI18n()

const rules = {
  required: (v: string) => !!v || $t('Field is required'),
  email: (v: string) => /.+@.+\..+/.test(v) || $t('E-mail must be valid'),
  minLength: (length: number) => (v: string) =>
    (v && v.length >= length) || $t('Must be at least {length} characters', { length }),
  maxLength: (length: number) => (v: string) =>
    (v && v.length <= length) || $t('Must be less than {length} characters', { length }),
}

// TODO: the alert must be updated according to the figma design
// Form submission function
const onSubmit = async () => {
  try {
    if (!form.value.privacyPolicies) {
      alert('You must agree to the privacy policy.')
      return
    }

    // Send data to the backend
    const response = await axios.post(`${API_BASE_URL}/signup`, {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      role: form.value.role, // Include role
    })

    alert('Signup successful! Redirecting to login...')
    router.push({ name: 'login' }) // Navigate to login page
  } catch (error) {
    console.error('Signup failed:', error)
    alert((error as any).response?.data?.message || 'Signup failed. Please try again.')
  }
}
</script>

<template>
  <RouterLink to="/">
    <div class="app-logo auth-logo">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="app-logo-title">
        {{ themeConfig.app.title }}
      </h1>
    </div>
  </RouterLink>

  <VRow
    no-gutters
    class="auth-wrapper"
  >
    <VCol
      md="8"
      class="d-none d-md-flex align-center justify-center position-relative"
    >
      <!-- here your illustrator -->
      <div class="d-flex align-center justify-center pa-10">
        <img
          :src="authThemeImg"
          class="auth-illustration w-100"
          alt="auth-illustration"
        >
      </div>
      <VImg
        :src="authThemeMask"
        class="d-none d-md-flex auth-footer-mask"
        alt="auth-mask"
      />
    </VCol>

    <VCol
      cols="12"
      md="4"
      class="auth-card-v2 d-flex align-center justify-center"
      style="background-color: rgb(var(--v-theme-surface));"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-5 pa-lg-7"
      >
        <VCardText>
          <h4 class="text-h4 mb-1">
            Adventure starts heree 🚀
          </h4>
          <p class="mb-0">
            {{ $t('Make your app management easy and fun!') }}
          </p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="onSubmit" v-slot="{ validate }">
            <VRow>
              <!-- Username -->
              <VCol cols="12">
                <VTextField
                  v-model="form.username"
                  autofocus
                  :label="$t('Username')"
                  :placeholder="$t('Johndoe')"
                  :rules="[rules.required, rules.minLength(3), rules.maxLength(20)]"
                />
              </VCol>

              <!-- email -->
              <VCol cols="12">
                <VTextField
                  v-model="form.email"
                  :label="$t('Email')"
                  type="email"
                  placeholder="johndoe@email.com"
                  :rules="[rules.required, rules.email]"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField
                  v-model="form.password"
                  :label="$t('Password')"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :rules="[rules.required, rules.minLength(8)]"
                  :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <br>
                <!-- Role -->
                <VSelect
                  v-model="form.role"
                  :label="$t('Role')"
                  :items="[$t('Student'), $t('Teacher'), $t('Assistant'), $t('Manager')]"
                  :rules="[rules.required]"
                />

                <div class="d-flex align-center my-6">
                  <VCheckbox
                    id="privacy-policy"
                    v-model="form.privacyPolicies"
                    inline
                  />
                  <VLabel
                    for="privacy-policy"
                    style="opacity: 1;"
                  >
                    <span class="me-1 text-high-emphasis">I agree to</span>
                    <a
                      href="javascript:void(0)"
                      class="text-primary"
                    >privacy policy & terms</a>
                  </VLabel>
                </div>

                <VBtn
                  block
                  type="submit"
                >
                  Sign up
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol cols="12">
                <div class="text-center text-base">
                  <span class="d-inline-block">Already have an account?</span> <RouterLink
                    class="text-primary d-inline-block"
                    :to="{ name: 'login' }"
                  >
                    Sign in instead
                  </RouterLink>
                </div>
              </VCol>

              <VCol cols="12">
                <div class="d-flex align-center">
                  <VDivider />
                  <span class="mx-4 text-high-emphasis">or</span>
                  <VDivider />
                </div>
              </VCol>

              <!-- auth providers -->
              <VCol
                cols="12"
                class="text-center"
              >
                <AuthProvider />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
