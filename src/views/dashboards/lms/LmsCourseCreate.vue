<script setup lang="ts">
import { API_BASE_URL } from '@/config/config';
import trophy from '@images/cards/trophy.png';
import axios from 'axios';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n()

// TODO add the editors(exist in the demo) for the description and about fields
// TODO research about that when the mother page is loaded that include this component, the dropdowns are not loaded
// TODO If the instructor is not verified, do not show in the list.
// TODO show a feedback message after the course is created successfully
// Todo Enable setting course prerequisites, which students must meet before registering.
// Todo Provide course category and tagging for better searchability.

const isDialogVisible = ref(false);
const course_name = ref('');
const instructor_id = ref();
// const assistant_id = ref();
const category_id = ref();
const capacity = ref('');
const visibility = ref('false');
const featured = ref(false);
const description = ref('');
const about = ref('');
const discussion_group_url = ref('');
const status = ref('draft');
const allow_waitlist = ref(false);
const start_date = ref(null);
const end_date = ref(null);
// const prerequisites = ref('');
const prerequisites = ref<string[]>([]);
const tags = ref([]);
const thumbnail_url = ref('');
const errors = ref<Record<string, string>>({});

const instructors = ref([]);
const categories = ref([]);
// const availablePrerequisites = ref([]);
const availablePrerequisites = ref<{ title: string; value: string }[]>([]);

const token = useCookie('accessToken').value;

const saveCourse = async () => {
  resetFieldErrors(['instructor_id', 'category_id', 'prerequisites']);

  console.log('Authorization Header:', `Bearer ${token}`);

  const formattedStartDate = start_date.value
    ? new Date(start_date.value).toISOString()
    : null;
  const formattedEndDate = end_date.value
    ? new Date(end_date.value).toISOString()
    : null;

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
    start_date: formattedStartDate,
    end_date: formattedEndDate,
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
        course_code: `CS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`, // Temporary random code
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
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        // prerequisites: prerequisites.value ? JSON.parse(prerequisites.value) : null,
        // prerequisites: prerequisites.value ? prerequisites.value : null,
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
    if (axios.isAxiosError(error)) {
      console.error('Failed to create course:', error.response?.data || error.message);
    } else {
      console.error('Failed to create course:', error);
    }
    // errors.value = error.response?.data?.errors || {};
    if (axios.isAxiosError(error) && error.response?.data?.errors) {
      errors.value = localizeErrors(error.response.data.errors);
    } else {
      console.error('Failed to create course:', error);
    }
    // console.error('Signup or OTP sending failed:', error)
  }
};

const fetchDropdownData = async () => {
  try {
    const [instructorResponse, categoryResponse, prerequisiteResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/instructors`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${API_BASE_URL}/categories`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${API_BASE_URL}/courses/prerequisites`, { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    instructors.value = instructorResponse.data.map((instructor: any) => ({
      title: `${instructor.first_name} ${instructor.last_name}`,
      value: instructor.id,
    }));

    categories.value = categoryResponse.data.map((category: any) => ({
      title: category.name,
      value: category.id,
    }));

    availablePrerequisites.value = prerequisiteResponse.data.map((prerequisite: any) => ({
      title: prerequisite.course_name,
      value: prerequisite.course_code,
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching dropdown data:', error.response?.data || error.message);
    } else {
      console.error('Error fetching dropdown data:', error);
    }
  }
};

const resetFieldErrors = (fields: string[]) => {
  fields.forEach((field) => {
    errors.value[field] = '';
  });
};

const resetForm = () => {
  course_name.value = '';
  capacity.value = '';
  visibility.value = 'false';
  featured.value = false;
  description.value = '';
  about.value = '';
  discussion_group_url.value = '';
  status.value = 'draft';
  allow_waitlist.value = false;
  start_date.value = null;
  end_date.value = null;
  prerequisites.value = [];
  tags.value = [];
  thumbnail_url.value = '';
};

const localizeErrors = (errors: Record<string, string[]>) => {
  const localizedErrors: Record<string, string> = {};
  for (const field in errors) {
    localizedErrors[field] = $t(`errors.${field}`) + ': ' + errors[field].join(', ');
  }
  return localizedErrors;
};

// Fetch dropdown data when the component is initialized
fetchDropdownData();

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
                <VTextField v-model="course_name" :label="$t('course.name')" placeholder="CourseName" :autofocus='true' />
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
                ]" outlined/>
              </VCol>

              <!-- Instructor -->
              <VCol cols="12" sm="6">
                <VSelect v-model="instructor_id" :label="$t('roles.instructor')"
                :items="instructors"
                outlined :error-messages="errors.instructor_id" />
              </VCol>

              <!-- Category -->
              <VCol cols="12" sm="6">
                <VSelect v-model="category_id" :label="$t('course.category')"
                :items="categories"
                outlined :error-messages="errors.category_id" />
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

              <!-- Thumbnail URL -->
              <VCol cols="12" sm="6">
                <VTextField v-model="thumbnail_url" :label="$t('course.thumbnailUrl')"
                  placeholder="https://example.com/thumbnail.jpg" outlined />
              </VCol>

              <!-- Tags -->
              <!-- <VCol cols="12" sm="6">
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
              </VCol> -->

              <!-- Prerequisites -->
              <!-- <VCol cols="12">
                <VAutocomplete v-model="prerequisites" multiple chips
                  :items="availablePrerequisites" item-text="title" item-value="value"
                  :label="$t('course.prerequisites')" outlined placeholder="Add prerequisites (e.g., CS101)"
                  :error-messages="errors.prerequisites"/>
              </VCol> -->

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
