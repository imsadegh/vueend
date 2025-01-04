<script setup lang="ts">
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

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
  first_name: '',
  last_name: '',
  phone_number: '',
  // username: '',
  // email: '',
  password: '',
  repeat_password: '',
  privacyPolicies: false,
  role_id: '', // Add role
})

const router = useRouter()
const isPasswordVisible = ref(false)
const { t: $t } = useI18n()

const rules = {
  required: (v: string) => !!v || $t('Field is required'),
  email: (v: string) => /.+@.+\..+/.test(v) || $t('E-mail must be valid'),
  minLength: (length: number) => (v: string) => (v && v.length >= length) || $t('Must be at least {length} characters', { length }),
  maxLength: (length: number) => (v: string) => (v && v.length <= length) || $t('Must be less than {length} characters', { length }),
  phone: (v: string) => /^09\d{9}$/.test(v) || $t('Phone number must be valid (e.g., 0912-345-6789)'),
  persian: (v: string) => /^[\u0600-\u06FF\s]+$/.test(v) || $t('Only Persian characters are allowed'),
  passwordsMatch: (v: string) => v === form.value.password || $t('Passwords must match'),
}

const isFormValid = computed(() => {
  return (
    form.value.first_name &&
    rules.required(form.value.first_name) === true &&
    rules.minLength(3)(form.value.first_name) === true &&
    rules.persian(form.value.first_name) === true &&
    form.value.password &&
    rules.required(form.value.password) === true &&
    rules.minLength(8)(form.value.password) === true &&
    form.value.repeat_password &&
    rules.passwordsMatch(form.value.repeat_password) === true &&
    form.value.role_id &&
    form.value.privacyPolicies
  )
})

// TODO: Convert the persian numbers to english numbers.
// TODO: the alert must be updated according to the figma design, add input validation
// Form submission function
const onSubmit = async () => {
  try {
    if (!form.value.privacyPolicies) {
      alert($t('You must agree to the privacy policy.'))
      return
    }

    // Step 1: Register the user
    // Send data to the backend
    const response = await axios.post(`${API_BASE_URL}/signup`, {
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      phone_number: form.value.phone_number,
      // username: form.value.username,
      // email: form.value.email,
      password: form.value.password,
      role_id: form.value.role_id, // Include role
    })

    // Step 2: Send OTP
    await axios.post(`${API_BASE_URL}/otp/send`, {
      phone_number: form.value.phone_number,
    })

    // alert($t('Signup successful! Redirecting to login...'))
    // router.push({ name: 'login' }) // Navigate to login page
    router.push({ path: '/pages/authentication/two-steps-v2', query: { phone_number: form.value.phone_number } }) // Navigate to two-step verification page
    
    // todo - if sign in failed, catch and show the error in the database.
  } catch (error) {
    console.error('Signup or OTP sending failed:', error)
    alert((error as any).response?.data?.message || $t('Signup failed. Please try again.'))
  }
  // console.log({ 
  //   first_name: form.value.first_name,
  //   last_name: form.value.last_name,
  //   phone_number: form.value.phone_number,
  //   password: form.value.password,
  //   role_id: form.value.role_id,
  // });
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
            {{ $t('Adventure starts here 🚀')}}
          </h4>
          <p class="mb-0">
            {{ $t('Make your app management easy and fun!') }}
          </p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="onSubmit" v-slot="{ validate }">
            <VRow>
              <!-- FirstName -->
              <VCol cols="12">
                <VTextField
                  v-model="form.first_name"
                  autofocus
                  :label="$t('First Name')"
                  :placeholder="$t('Enter your first name')"
                  :rules="[rules.required, rules.minLength(3), rules.persian]"
                />
              </VCol>

              <!-- LastName -->
              <VCol cols="12">
                <VTextField
                  v-model="form.last_name"
                  :label="$t('Last Name')"
                  :placeholder="$t('Enter your last name')"
                  :rules="[rules.required, rules.minLength(3), rules.persian]"
                />
              </VCol>

              <!-- Username -->
              <!-- <VCol cols="12">
                <VTextField
                  v-model="form.username"
                  :label="$t('Username')"
                  :placeholder="$t('Enter your username')"
                  :rules="[rules.required, rules.minLength(3), rules.maxLength(20)]"
                />
              </VCol> -->

              <!-- phone number -->
              <VCol cols="12">
                <VTextField
                  v-model="form.phone_number"
                  :label="$t('Phone Number')"
                  type="tel"
                  :placeholder="$t('09**-***-****')"
                  :rules="[rules.required, rules.phone]"
                  @input="form.phone_number = form.phone_number.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString()).replace(/\D/g, '')"
                />
              </VCol>

              <!-- TODO - Add password validator -->
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

              <!-- repeat password -->
              <!-- <VCol cols="12"> -->
                <VTextField
                  v-model="form.repeat_password"
                  :label="$t('Repeat Password')"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :rules="[rules.required, rules.passwordsMatch]"
                  :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
              <!-- </VCol> -->

                <br>
                <!-- Role -->
                <VSelect
                  v-model="form.role_id"
                  :label="$t('Role')"
                  :items="[
                    { text: $t('Student'), value: 1 },
                    { text: $t('Teacher'), value: 2 },
                    { text: $t('Assistant'), value: 3 },
                    { text: $t('Manager'), value: 4 },
                  ]"
                  item-title="text"
                  item-value="value"
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
                    <span class="me-1 text-high-emphasis">
                      {{ $t ('I agree to')}}
                    </span>
                    <!-- <a
                      href="javascript:void(0)"
                      class="text-primary"
                    >{{ $t ('privacy policy & terms')}}</a> -->
                  </VLabel>
                </div>

                <VBtn
                  block
                  type="submit"
                  :disabled="!isFormValid"
                >
                  {{$t ('Sign Up')}}
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol cols="12">
                <div class="text-center text-base">
                  <span class="d-inline-block">
                    {{$t ('Already have an account?')}}
                  </span> <RouterLink
                    class="text-primary d-inline-block"
                    :to="{ name: 'login' }"
                  >
                    {{$t ('Sign in instead')}}
                  </RouterLink>
                </div>
              </VCol>

              <!-- <VCol cols="12">
                <div class="d-flex align-center">
                  <VDivider />
                    <span class="mx-4 text-high-emphasis">or</span>
                  <VDivider />
                </div>
              </VCol>-->

              <!-- auth providers -->
              <!-- <VCol
                cols="12"
                class="text-center"
              >
                <AuthProvider />
              </VCol> -->
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
