<script lang="ts" setup>
import { API_BASE_URL } from '@/config/config'
import axios from 'axios'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const token = useCookie('accessToken').value
const userData = useCookie<any>('userData')

const refInputEl = ref<HTMLElement>()
const isLoading = ref(false)
const isSaving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Form data
const accountDataLocal = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone_number: '',
  melli_code: '',
  birth_date: '',
  sex: '',
  address: '',
  city: '',
  zip_code: '',
  avatar: '',
})

// Form errors
const errors = ref<Record<string, string[]>>({})

// Options
const sexOptions = [
  { title: t('profile.male'), value: 'male' },
  { title: t('profile.female'), value: 'female' },
]

const cityOptions = [
  'تهران',
  'مشهد',
  'اصفهان',
  'شیراز',
  'تبریز',
  'کرج',
  'قم',
  'اهواز',
  'کرمانشاه',
  'ارومیه',
]

// Fetch user profile on mount
onMounted(async () => {
  await fetchProfile()
})

async function fetchProfile() {
  isLoading.value = true
  try {
    const response = await axios.get(`${API_BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    Object.assign(accountDataLocal.value, response.data)
  }
  catch (error: any) {
    console.error('Error fetching profile:', error)
    errorMessage.value = t('profile.errorFetchingProfile')
  }
  finally {
    isLoading.value = false
  }
}

async function saveProfile() {
  isSaving.value = true
  errors.value = {}
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const response = await axios.put(`${API_BASE_URL}/profile`, accountDataLocal.value, {
      headers: { Authorization: `Bearer ${token}` },
    })

    // Update the userData cookie with new values
    if (userData.value) {
      userData.value = {
        ...userData.value,
        first_name: response.data.user.first_name,
        last_name: response.data.user.last_name,
        full_name: response.data.user.full_name,
        email: response.data.user.email,
        phone_number: response.data.user.phone_number,
        avatar: response.data.user.avatar,
      }
    }

    successMessage.value = t('profile.profileUpdatedSuccess')
  }
  catch (error: any) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    }
    else {
      errorMessage.value = t('profile.errorUpdatingProfile')
    }
  }
  finally {
    isSaving.value = false
  }
}

// Reset form to original data
async function resetForm() {
  await fetchProfile()
  successMessage.value = ''
  errorMessage.value = ''
  errors.value = {}
}

// Change avatar
async function changeAvatar(event: Event) {
  const fileReader = new FileReader()
  const { files } = event.target as HTMLInputElement

  if (files && files.length) {
    // Show preview
    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string')
        accountDataLocal.value.avatar = fileReader.result
    }

    // Upload to server
    const formData = new FormData()
    formData.append('avatar', files[0])

    try {
      const response = await axios.post(`${API_BASE_URL}/profile/avatar`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      accountDataLocal.value.avatar = response.data.avatar

      // Update userData cookie
      if (userData.value)
        userData.value.avatar = response.data.avatar

      successMessage.value = t('profile.avatarUpdatedSuccess')
    }
    catch (error: any) {
      errorMessage.value = t('profile.errorUploadingAvatar')
    }
  }
}

// Reset avatar
function resetAvatar() {
  accountDataLocal.value.avatar = ''
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <!-- Success/Error messages -->
      <VAlert
        v-if="successMessage"
        type="success"
        variant="tonal"
        closable
        class="mb-4"
        @click:close="successMessage = ''"
      >
        {{ successMessage }}
      </VAlert>

      <VAlert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        closable
        class="mb-4"
        @click:close="errorMessage = ''"
      >
        {{ errorMessage }}
      </VAlert>

      <VCard :loading="isLoading">
        <VCardText>
          <div class="d-flex mb-10">
            <!-- Avatar -->
            <VAvatar
              rounded
              size="100"
              class="me-6"
              :image="accountDataLocal.avatar"
              :color="!accountDataLocal.avatar ? 'primary' : undefined"
            >
              <VIcon
                v-if="!accountDataLocal.avatar"
                icon="ri-user-line"
                size="50"
              />
            </VAvatar>

            <!-- Upload Photo -->
            <form class="d-flex flex-column justify-center gap-4">
              <div class="d-flex flex-wrap gap-4">
                <VBtn
                  color="primary"
                  @click="refInputEl?.click()"
                >
                  <VIcon
                    icon="ri-upload-cloud-line"
                    class="d-sm-none"
                  />
                  <span class="d-none d-sm-block">{{ t('profile.uploadPhoto') }}</span>
                </VBtn>
                <input
                  ref="refInputEl"
                  type="file"
                  name="file"
                  accept=".jpeg,.png,.jpg,GIF"
                  hidden
                  @input="changeAvatar"
                >
                <VBtn
                  type="reset"
                  color="error"
                  variant="outlined"
                  @click="resetAvatar"
                >
                  <span class="d-none d-sm-block">{{ t('profile.reset') }}</span>
                  <VIcon
                    icon="ri-refresh-line"
                    class="d-sm-none"
                  />
                </VBtn>
              </div>
              <p class="text-body-1 mb-0">
                {{ t('profile.allowedFormats') }}
              </p>
            </form>
          </div>

          <!-- Form -->
          <VForm @submit.prevent="saveProfile">
            <VRow>
              <!-- First Name -->
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="accountDataLocal.first_name"
                  :label="t('profile.firstName')"
                  :error-messages="errors.first_name"
                />
              </VCol>

              <!-- Last Name -->
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  v-model="accountDataLocal.last_name"
                  :label="t('profile.lastName')"
                  :error-messages="errors.last_name"
                />
              </VCol>

              <!-- Email -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="accountDataLocal.email"
                  :label="t('profile.email')"
                  type="email"
                  :error-messages="errors.email"
                />
              </VCol>

              <!-- Phone -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="accountDataLocal.phone_number"
                  :label="t('profile.phoneNumber')"
                  dir="ltr"
                  :error-messages="errors.phone_number"
                />
              </VCol>

              <!-- Melli Code -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="accountDataLocal.melli_code"
                  :label="t('profile.melliCode')"
                  dir="ltr"
                  :error-messages="errors.melli_code"
                />
              </VCol>

              <!-- Birth Date -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="accountDataLocal.birth_date"
                  :label="t('profile.birthDate')"
                  type="date"
                  :error-messages="errors.birth_date"
                />
              </VCol>

              <!-- Sex -->
              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="accountDataLocal.sex"
                  :label="t('profile.sex')"
                  :items="sexOptions"
                  :error-messages="errors.sex"
                  clearable
                />
              </VCol>

              <!-- City -->
              <VCol
                cols="12"
                md="6"
              >
                <VCombobox
                  v-model="accountDataLocal.city"
                  :label="t('profile.city')"
                  :items="cityOptions"
                  :error-messages="errors.city"
                  clearable
                />
              </VCol>

              <!-- Address -->
              <VCol cols="12">
                <VTextarea
                  v-model="accountDataLocal.address"
                  :label="t('profile.address')"
                  rows="2"
                  :error-messages="errors.address"
                />
              </VCol>

              <!-- Zip Code -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="accountDataLocal.zip_code"
                  :label="t('profile.zipCode')"
                  dir="ltr"
                  :error-messages="errors.zip_code"
                />
              </VCol>

              <!-- Form Actions -->
              <VCol
                cols="12"
                class="d-flex flex-wrap gap-4"
              >
                <VBtn
                  type="submit"
                  :loading="isSaving"
                >
                  {{ t('profile.saveChanges') }}
                </VBtn>

                <VBtn
                  color="secondary"
                  variant="outlined"
                  type="reset"
                  @click.prevent="resetForm"
                >
                  {{ t('profile.reset') }}
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
