<script lang="ts" setup>
import { API_BASE_URL } from '@/config/config'
import axios from 'axios'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const token = useCookie('accessToken').value

const isCurrentPasswordVisible = ref(false)
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const errors = ref<Record<string, string[]>>({})

const passwordRequirements = computed(() => [
  t('security.requirement1'),
  t('security.requirement2'),
  t('security.requirement3'),
])

async function changePassword() {
  isLoading.value = true
  successMessage.value = ''
  errorMessage.value = ''
  errors.value = {}

  try {
    await axios.put(`${API_BASE_URL}/profile/password`, {
      current_password: currentPassword.value,
      new_password: newPassword.value,
      new_password_confirmation: confirmPassword.value,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    })

    successMessage.value = t('security.passwordChangedSuccess')
    resetForm()
  }
  catch (error: any) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    }
    else {
      errorMessage.value = t('security.errorChangingPassword')
    }
  }
  finally {
    isLoading.value = false
  }
}

function resetForm() {
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <!-- Success/Error messages -->
      <VAlert v-if="successMessage" type="success" variant="tonal" closable class="mb-4"
        @click:close="successMessage = ''">
        {{ successMessage }}
      </VAlert>

      <VAlert v-if="errorMessage" type="error" variant="tonal" closable class="mb-4" @click:close="errorMessage = ''">
        {{ errorMessage }}
      </VAlert>

      <VCard>
        <VCardItem class="pb-6">
          <VCardTitle>{{ t('security.changePassword') }}</VCardTitle>
        </VCardItem>
        <VForm @submit.prevent="changePassword">
          <VCardText class="pt-0">
            <!-- Current Password -->
            <VRow>
              <VCol cols="12" md="6">
                <VTextField v-model="currentPassword" :type="isCurrentPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isCurrentPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  autocomplete="current-password" :label="t('security.currentPassword')" placeholder="············"
                  :error-messages="errors.current_password" dir="ltr"
                  @click:append-inner="isCurrentPasswordVisible = !isCurrentPasswordVisible" />
              </VCol>
            </VRow>

            <!-- New Password -->
            <VRow>
              <VCol cols="12" md="6">
                <VTextField v-model="newPassword" :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isNewPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  :label="t('security.newPassword')" autocomplete="new-password" placeholder="············"
                  :error-messages="errors.new_password" dir="ltr"
                  @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible" />
              </VCol>

              <VCol cols="12" md="6">
                <VTextField v-model="confirmPassword" :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  autocomplete="new-password" :label="t('security.confirmPassword')" placeholder="············"
                  dir="ltr" @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible" />
              </VCol>
            </VRow>
          </VCardText>

          <!-- Password Requirements -->
          <VCardText>
            <h6 class="text-h6 text-medium-emphasis mt-1">
              {{ t('security.passwordRequirements') }}
            </h6>

            <VList>
              <VListItem v-for="(item, index) in passwordRequirements" :key="index" class="px-0">
                <template #prepend>
                  <VIcon size="8" icon="ri-circle-fill"
                    color="rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity))" />
                </template>
                <VListItemTitle class="text-medium-emphasis text-wrap">
                  {{ item }}
                </VListItemTitle>
              </VListItem>
            </VList>

            <!-- Action Buttons -->
            <div class="d-flex flex-wrap gap-4 mt-2">
              <VBtn type="submit" :loading="isLoading">
                {{ t('security.saveChanges') }}
              </VBtn>

              <VBtn type="reset" color="secondary" variant="outlined" @click.prevent="resetForm">
                {{ t('security.reset') }}
              </VBtn>
            </div>
          </VCardText>
        </VForm>
      </VCard>
    </VCol>
  </VRow>
</template>
