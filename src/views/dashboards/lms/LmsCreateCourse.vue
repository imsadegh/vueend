<script setup lang="ts">
import { API_BASE_URL } from '@/config/config';
import trophy from '@images/cards/trophy.png';
import axios from 'axios';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n()

// todo add the editors(exist in the demo) for the description and about fields

const isDialogVisible = ref(false);
const course_name = ref('');
const instructor_id = ref();
// const assistant_id = ref();
const category_id = ref();
const capacity = ref('');
const visibility = ref('');
const featured = ref(false);
const description = ref('');
const about = ref('');
const discussion_group_url = ref('');
const status = ref('');
const allow_waitlist = ref(false);
const start_date = ref(null);
const end_date = ref(null);
const prerequisites = ref('');
const tags = ref([]);
const thumbnail_url = ref('');
const errors = ref<Record<string, string>>({});

const token = useCookie('accessToken').value;

const saveCourse = async () => {
  console.log('Authorization Header:', `Bearer ${token}`);

  console.log('Payload:', {
    course_name: course_name.value,
    course_code: `COURSE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    instructor_id: instructor_id.value,
    category_id: category_id.value,
    capacity: capacity.value ? parseInt(capacity.value) : null,
    visibility: visibility.value === 'true',
    featured: featured.value,
    description: description.value,
    about: about.value,
    discussion_group_url: discussion_group_url.value || null,
    status: status.value,
    allow_waitlist: allow_waitlist.value,
    start_date: start_date.value,
    end_date: end_date.value,
    prerequisites: prerequisites.value,
    tags: tags.value,
    thumbnail_url: thumbnail_url.value || null,
  });

  try {
    if (!token) {
      console.error('Access token is missing or expired.');
      return;
    }
    const response = await axios.post(
      `${API_BASE_URL}/courses`,
      {
        course_name: course_name.value,
        course_code: `COURSE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`, // Temporary random code
        instructor_id: instructor_id.value,
        // assistant_id: null,
        category_id: category_id.value, // Replace with the actual category ID
        capacity: capacity.value ? parseInt(capacity.value) : null,
        visibility: visibility.value === 'true',
        featured: featured.value,
        description: description.value,
        about: about.value || null,
        discussion_group_url: discussion_group_url.value || null,
        status: status.value,
        allow_waitlist: allow_waitlist.value,
        // start_date: start_date.value,
        // end_date: end_date.value,
        // prerequisites: prerequisites.value ? JSON.parse(prerequisites.value) : null,
        // prerequisites: prerequisites.value, // Directly send the array
        // tags: tags.value,
        thumbnail_url: thumbnail_url.value || null,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the Authorization header
          'Content-Type': 'application/json', // Specify JSON payload
        },
      }
    );

    console.log('Course created successfully:', response.data);
    isDialogVisible.value = false;
    resetForm(); // Reset form
  } catch (error) {
    console.error('Failed to create course:', error.response?.data || error.message);
    errors.value = error.response?.data?.errors || {};
    // console.error('Signup or OTP sending failed:', error)
  }
};

const resetForm = () => {
  course_name.value = '';
  capacity.value = '';
  visibility.value = '';
  featured.value = false;
  description.value = '';
  about.value = '';
  discussion_group_url.value = '';
  status.value = '';
  allow_waitlist.value = false;
  start_date.value = null;
  end_date.value = null;
  prerequisites.value = '';
  tags.value = [];
  thumbnail_url.value = '';
};

</script>

<template>
  <VCard class="position-relative">
    <VCardText>
      <div class="mb-3">
        <h5 class="text-h5 text-wrap">
          {{ $t('course.create') }}
          <strong>{{ $t('course.course') }}</strong>
          {{ $t('course.new') }}
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

      <VDialog v-model="isDialogVisible" max-width="800">
        <!-- Dialog Activator -->
        <template #activator="{ props }">
          <VBtn v-bind="props">
            {{ $t('course.create') }}
          </VBtn>
        </template>

        <!-- Dialog Content -->
        <VCard :title="$t('course.titleCreate')">
          <DialogCloseBtn variant="text" size="default" @click="isDialogVisible = false" />

          <VCardText>
            <VRow>
              <!-- Course Name -->
              <VCol cols="12" sm="6" md="4">
                <VTextField v-model="course_name" :label="$t('course.name')" placeholder="Mind Map" />
              </VCol>

              <!-- Capacity -->
              <VCol cols="12" sm="6" md="4">
                <VTextField v-model="capacity" :label="$t('course.capacity')" type="number" min="0"
                  persistent-placeholder />
              </VCol>

              <!-- Visibility -->
              <VCol cols="12" sm="6" md="4">
                <VSelect v-model="visibility" :label="$t('course.visibility')" :items="[
                  { title: $t('course.visibilityPublic'), value: 'true' },
                  // { title: $t('course.visibilityPrivate'), value: 'Private' },
                  { title: $t('course.visibilityHidden'), value: 'false' }
                ]" outlined />
              </VCol>

              <!-- Instructor -->
              <VCol cols="12" sm="6">
                <VSelect v-model="instructor_id" :label="$t('roles.instructor')" :items="[
                  { title: 'instructor 5', value: 5 },
                  { title: 'instructor 2', value: 2 },
                  { title: 'instructor 3', value: 3 }
                ]" outlined :error-messages="errors.instructor_id" />
              </VCol>

              <!-- Category -->
              <VCol cols="12" sm="6">
                <VSelect v-model="category_id" :label="$t('course.category')" :items="[
                  { title: 'Category 7', value: 7 },
                  { title: 'Category 1', value: 1 },
                  { title: 'Category 2', value: 2 }
                ]" outlined :error-messages="errors.category_id" />
              </VCol>

              <VRow>
                <!-- Allow Waitlist -->
                <VCol cols="12" sm="6">
                  <VCheckbox v-model="allow_waitlist" :label="$t('course.allowWaitlist')" />
                </VCol>

                <!-- Featured -->
                <VCol cols="12" sm="6">
                  <VCheckbox v-model="featured" :label="$t('course.featured')" />
                </VCol>
              </VRow>

              <!-- Description -->
              <VCol cols="12">
                <VTextarea v-model="description" :label="$t('course.description')"
                  :placeholder="$t('course.descriptionPlaceholder')" outlined rows="4" />
              </VCol>

              <!-- About -->
              <VCol cols="12">
                <VTextarea v-model="about" :label="$t('course.about')" :placeholder="$t('course.aboutPlaceholder')"
                  outlined rows="4" />
              </VCol>

              <!-- Discussion Group URL -->
              <VCol cols="12" sm="6">
                <VTextField v-model="discussion_group_url" :label="$t('course.discussionGroupUrl')"
                  placeholder="https://example.com/group" outlined />
              </VCol>

              <!-- Status -->
              <VCol cols="12" sm="6">
                <VSelect v-model="status" :label="$t('course.status')" :items="[
                  { title: $t('course.active'), value: 'active' },
                  { title: $t('course.draft'), value: 'draft' },
                  { title: $t('course.archived'), value: 'archived' }
                ]" outlined />
              </VCol>

              <VRow>
                <!-- Start Date -->
                <VCol cols="12" sm="6">
                  <VDatePicker v-model="start_date" title="" :header="$t('course.startDate')" />
                </VCol>

                <!-- End Date -->
                <VCol cols="12" sm="6">
                  <VDatePicker v-model="end_date" title="" :header="$t('course.endDate')" outlined />
                </VCol>
              </VRow>

              <!-- Prerequisites -->
              <!-- <VCol cols="12">
      <VAutocomplete
        v-model="prerequisites"
        multiple
        chips
        :items="['CS101', 'CS102', 'CS103']" 
        :label="$t('course.prerequisites')"
        outlined
        placeholder="Add prerequisites (e.g., CS101)"
      />
        <small class="text-error" v-if="errors.prerequisites">
          {{ errors.prerequisites }}
        </small>
    </VCol> -->

              <!-- Tags -->
              <VCol cols="12" sm="6">
                <VChipGroup v-model="tags" multiple :label="$t('course.tags')"
                  :placeholder="$t('course.tagsPlaceholder')">
                  <VChip v-for="tag in [
                    { text: $t('course.tagBeginner'), value: 'Beginner' },
                    { text: $t('course.tagIntermediate'), value: 'Intermediate' },
                    { text: $t('course.tagAdvanced'), value: 'Advanced' }
                  ]" :key="tag.value" :value="tag">
                    {{ tag.text }}
                  </VChip>
                </VChipGroup>
              </VCol>

              <!-- Thumbnail URL -->
              <VCol cols="12" sm="6">
                <VTextField v-model="thumbnail_url" :label="$t('course.thumbnailUrl')"
                  placeholder="https://example.com/thumbnail.jpg" outlined />
              </VCol>

            </VRow>
          </VCardText>

          <!-- Dialog Footer -->
          <VCardActions class="d-flex justify-end flex-wrap gap-4">
            <VBtn color="secondary" @click="isDialogVisible = false">
              {{ $t('button.close') }}
            </VBtn>
            <VBtn color="primary" @click="saveCourse">
              {{ $t('button.save') }}
            </VBtn>
          </VCardActions>

        </VCard>
      </VDialog>

    </VCardText>

    <!-- Trophy -->
    <VImg :src="trophy" class="trophy flip-in-rtl" />
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
