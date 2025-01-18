<script setup lang="ts">
import trophy from '@images/cards/trophy.png';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n()

// todo add the editors(exist in the demo) for the description and about fields

const isDialogVisible = ref(false)
const course_name = ref('')
const capacity = ref('')
const visibility = ref('')
const featured = ref('')
const description = ref('')
const about = ref('')
const discussion_group_url = ref()
const status = ref<string[]>([])
const allow_waitlist = ref()
const start_date = ref()
const end_date = ref()
const prerequisites = ref()
const tags = ref()
const thumbnail_url = ref()

const saveCourse = () => {
  console.log({
    course_name,
    capacity,
    visibility,
    featured,
    description,
    about,
    discussion_group_url,
    status,
    allow_waitlist,
    start_date,
    end_date,
    prerequisites,
    tags,
    thumbnail_url,
  });

  // Add API call or logic to save the course here
  isDialogVisible.value = false;
};

</script>

<template>
  <VCard class="position-relative">
    <VCardText>
      <div class="mb-3">
        <h5 class="text-h5 text-wrap">
          {{$t('course.create')}}
          <strong>{{$t('course.course')}}</strong> 
          {{$t('course.new')}}
          <span class="text-high-emphasis"> 🎉</span>
        </h5>

        <div class="text-subtitle-1">
          <!-- Best seller of the month -->
        </div>
      </div>

      <h4 class="text-h4 text-primary">
        <!-- $42.8k -->
      </h4>
      <div class="text-body-1 mb-3">
        <!-- 78% of target <span class="text-high-emphasis">🚀</span> -->
      </div>
      
      <!-- <VBtn size="small">
        {{$t('course.create')}}
      </VBtn> -->

      <!-- aaa -->
      <VDialog
    v-model="isDialogVisible"
    max-width="800"
  >
    <!-- Dialog Activator -->
    <template #activator="{ props }">
      <VBtn v-bind="props">
        {{$t('course.create')}}
      </VBtn>
    </template>

    <!-- Dialog Content -->
    <VCard :title="$t('course.titleCreate')">
      <DialogCloseBtn
        variant="text"
        size="default"
        @click="isDialogVisible = false"
      />

      <VCardText>
        <VRow>
          <!-- Course Name -->
          <VCol cols="12" sm="6" md="4">
            <VTextField
              v-model="course_name"
              :label="$t('course.name')"
              placeholder="Mind Map"
              outlined
            />
          </VCol>

          <!-- Capacity -->
          <VCol cols="12" sm="6" md="4">
            <VTextField
              id="mobileHorizontalIcons"
              v-model="capacity"
              :label="$t('course.capacity')"
              type="number"
              min="0"
              persistent-placeholder
            />
          </VCol>

          <!-- Visibility -->
          <VCol cols="12" sm="6" md="4">
            <VSelect
              v-model="visibility"
              :label="$t('course.visibility')"
              :items="[
                { title: $t('course.visibilityPublic'), value: 'Public' },
                { title: $t('course.visibilityPrivate'), value: 'Private' },
                { title: $t('course.visibilityHidden'), value: 'Hidden' }
              ]"
              outlined
            />
          </VCol>

          <!-- Featured -->
          <VCol cols="12" sm="6">
          <VCheckbox
            v-model="featured"
            :label="$t('course.featured')"
          />
          </VCol>

          <!-- Description -->
        <VCol cols="12">
          <VTextarea
            v-model="description"
            :label="$t('course.description')"
            :placeholder="$t('course.descriptionPlaceholder')"
            outlined
            rows="4"
          />
        </VCol>

          <!-- About -->
        <VCol cols="12">
          <VTextarea
            v-model="about"
            :label="$t('course.about')"
            :placeholder="$t('course.aboutPlaceholder')"
            outlined
            rows="4"
          />
        </VCol>

        <!-- Discussion Group URL -->
        <VCol cols="12" sm="6">
          <VTextField
            v-model="discussion_group_url"
            :label="$t('course.discussionGroupUrl')"
            placeholder="https://example.com/group"
            outlined
          />
        </VCol>

        <!-- Status -->
         <!-- <VRow> -->
        <VCol cols="12" sm="6">
            <VSelect
              v-model="status"
              :label="$t('course.status')"
              :items="[
              { title: $t('course.active'), value: 'active' },
              { title: $t('course.inactive'), value: 'inactive' },
              { title: $t('course.archived'), value: 'archived' }
              ]"
              outlined
            />
        </VCol>

        <!-- Allow Waitlist -->
        <VCol cols="12" sm="6">
          <VCheckbox
            v-model="allow_waitlist"
            :label="$t('course.allowWaitlist')"
          />
        </VCol>
        <!-- </VRow> -->

        <!-- Start Date -->
        <VRow>
        <VCol
         cols="12" sm="6">
          <VDatePicker
            v-model="start_date"
            title=""
            :header="$t('course.startDate')"
          />
        </VCol>

        <!-- End Date -->
        <VCol cols="12" sm="6">
          <VDatePicker
            v-model="end_date"
            title=""
            :header="$t('course.endDate')"
            outlined
          />
        </VCol>
      </VRow>

        <!-- Prerequisites -->
        <VCol cols="12">
          <VTextarea
            v-model="prerequisites"
            :label="$t('course.prerequisites')"
            :placeholder="$t('course.prerequisitesPlaceholder')"
            outlined
            rows="4"
          />
        </VCol>

        <!-- Tags -->
        <VCol cols="12" sm="6">
          <VChipGroup
            v-model="tags"
            multiple
            :label="$t('course.tags')"
            :placeholder="$t('course.tagsPlaceholder')"
          >
            <VChip
            v-for="tag in [
                { text: $t('course.tagBeginner'), value: 'Beginner' },
                { text: $t('course.tagIntermediate'), value: 'Intermediate' },
                { text: $t('course.tagAdvanced'), value: 'Advanced' }
              ]"
              :key="tag.value"
              :value="tag"
            >
              {{ tag.text }}
            </VChip>
          </VChipGroup>
        </VCol>

        <!-- Thumbnail URL -->
        <VCol cols="12" sm="6">
          <VTextField
            v-model="thumbnail_url"
            :label="$t('course.thumbnailUrl')"
            placeholder="https://example.com/thumbnail.jpg"
            outlined
          />
        </VCol>

        </VRow>
      </VCardText>

      <!-- Dialog Footer -->
      <VCardActions class="d-flex justify-end flex-wrap gap-4">
        <VBtn
        color="secondary"
        @click="isDialogVisible = false"
      >
        {{$t('button.close')}}
      </VBtn>
      <VBtn
        color="primary"

      >
        {{$t('button.save')}}
      </VBtn>
    </VCardActions>

    </VCard>
  </VDialog>
      <!-- aaa -->

    </VCardText>

    <!-- Trophy -->
    <VImg
      :src="trophy"
      class="trophy flip-in-rtl"
    />
  </VCard>
</template>

<style lang="scss">
.v-card .triangle-bg {
  position: absolute;
  inline-size: 10.375rem;
  inset-block-end: 0;
  inset-inline-end: 0;
}

.v-card .trophy {
  position: absolute;
  inline-size: 6.625rem;
  inset-block-end: 0;
  inset-inline-end: 1.25rem;
}
</style>
