<script setup lang="ts">
import { API_BASE_URL } from '@/config/config';
import LmsExamAttempt from '@/views/dashboards/lms/LmsExamAttempt.vue';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

interface Props {
  searchQuery: string;
}

const props = defineProps<Props>();
const token = useCookie('accessToken').value;
const router = useRouter();
const { t: $t } = useI18n()


// Table/pagination & filter state
const itemsPerPage = ref(6);
const page = ref(1);
const sortBy = ref<string | null>(null);
const orderBy = ref<string | null>(null);
const hideCompleted = ref(true);
const label = ref('All Courses');

// Data state for enrolled courses
const enrolledCourses = ref<any[]>([]);
const totalCourses = ref(0);

const fetchEnrolledCourses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/student/courses`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        q: props.searchQuery,
        hideCompleted: hideCompleted.value,
        label: label.value,
        itemsPerPage: itemsPerPage.value,
        page: page.value,
        sortBy: sortBy.value,
        orderBy: orderBy.value,
      },
    });
    // Assume the API returns an object with courses and total count
    enrolledCourses.value = response.data.courses;
    totalCourses.value = response.data.total;
  } catch (error) {
    console.error('Error fetching enrolled courses:', (error as any).response?.data || (error as any).message);
  }
};

/* exams mapped by courseId */
const examsByCourse = ref<Record<string, any[]>>({})
const selectedExamId = ref<number | null>(null)
const isExamDialog = ref(false)

const fetchExamsForCourse = async (courseId: number) => {
  const { data } = await axios.get(`${API_BASE_URL}/exams`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { course_id: courseId },
  })
  examsByCourse.value[courseId] = data
}

// determine if an exam is currently startable by student
const now = Date.now()
const isExamAvailable = (exam: any): boolean => {
  return exam.is_published
    && exam.status === 'active'
    && (!exam.time_open || new Date(exam.time_open).getTime() <= now)
    && (!exam.time_close || new Date(exam.time_close).getTime() >= now)
}

// when user clicks a specific exam button
const onStartExam = (exam: any) => {
  if (!confirmStart($t('exam.startConfirm'))) return
  selectedExamId.value = exam.id
  isExamDialog.value = true
}

watch(
  [hideCompleted, label, () => props.searchQuery, page, sortBy, orderBy],
  () => {
    page.value = 1; // Reset to first page on filter changes
    fetchEnrolledCourses();
  }
);

watch(enrolledCourses, (list) => {
  list.forEach(c => fetchExamsForCourse(c.id))
})

onMounted(() => {
  fetchEnrolledCourses();
});

// Utility: Resolve chip color based on a tag
// const resolveChipColor = (tag: string) => {
//   if (tag === 'Web') return 'primary';
//   if (tag === 'Art') return 'success';
//   if (tag === 'UI/UX') return 'error';
//   if (tag === 'Psychology') return 'warning';
//   if (tag === 'Design') return 'info';
//   return 'default';
// };

// Add a function to handle redirection based on enrollment status.

const goToCourse = (course: any) => {
  if (course.can_redirect) {
    router.push({ name: 'course-details', params: { courseId: course.id } });
  } else {
    console.warn(
      `Course "${course.course_name}" is not accessible. Enrollment status: ${course.enrollment_status}`
    );
  }
};

const confirmStart = (message: string): boolean => window.confirm(message)

</script>

<template>
  <VCard class="mb-6">
    <VCardText>
      <!-- Header with filtering options -->
      <div class="d-flex justify-space-between align-center flex-wrap gap-4 mb-6">
        <div>
          <h5 class="text-h5">{{ $t('academy.myCourses') }}</h5>
          <div class="text-body-1">
            {{ $t('academy.totalCoursesPurchased', { count: totalCourses }) }}
          </div>
        </div>
        <div class="d-flex flex-wrap align-center gap-y-4 gap-x-6">
          <VSelect v-model="label" density="compact" :items="[
            { title: $t('academy.web'), value: 'web' },
            { title: $t('academy.art'), value: 'art' },
            { title: $t('academy.uiUx'), value: 'ui/ux' },
            { title: $t('academy.psychology'), value: 'psychology' },
            { title: $t('academy.design'), value: 'design' },
            { title: $t('academy.allCourses'), value: 'All Courses' }
          ]" style="min-inline-size: 250px;" />
          <VSwitch v-model="hideCompleted" :label="$t('academy.hideCompleted')" />
        </div>
      </div>

      <!-- Enrolled Courses List -->
      <div v-if="enrolledCourses.length" class="mb-6">
        <VRow class="match-height">
          <template v-for="course in enrolledCourses" :key="course.id">
            <VCol cols="12" md="4" sm="6">
              <VCard flat border>

                <!-- Course Thumbnail -->
                <!-- <div class="pa-2">
                  <VImg
                    @click="router.push({ name: 'course-details', params: { courseId: course.id } })"
                    class="cursor-pointer"
                  />
                </div> -->
                <VCardText class="pt-3">

                  <!-- Tags / Category Chips -->
                  <!-- <div class="d-flex justify-space-between align-center mb-4">
                    <VChip
                      v-if="course.tags && course.tags.length"
                      variant="tonal"
                      :color="resolveChipColor(course.tags[0])"
                      size="small"
                    >
                      {{ course.tags[0] }}
                    </VChip>
                  </div> -->

                  <!-- Course Title -->
                  <h5 class="text-h5 mb-1">
                    <!-- <RouterLink :to="{ name: 'apps-academy-course-details', params: { courseId: course.id } }" class="course-title">
                      {{ course.course_name }}
                    </RouterLink> -->

                    <!-- <RouterLink 
                      v-if="course.can_redirect" 
                      :to="{ name: 'apps-academy-course-details', params: { courseId: course.id } }"
                      class="course-title">
                      {{ course.course_name }}
                    </RouterLink>
                    <span v-else class="course-title disabled">
                      {{ course.course_name }} ({{ course.enrollment_status }})
                    </span> -->

                    <span class="course-title" @click="goToCourse(course)" style="cursor: pointer;">
                      {{ course.course_name }}
                    </span>
                    <!-- <small v-if="!course.can_redirect">
                      ({{ $t(`enrollment.${course.enrollment_status}`) }})
                    </small> -->


                  </h5>

                  <!-- Course Description -->
                  <p>{{ course.description }}</p>

                  <!-- Course Progress (if available) -->
                  <!-- <div v-if="course.progress !== undefined" class="mb-2">
                    <VProgressLinear
                      :model-value="course.progress"
                      rounded
                      rounded-bar
                      color="primary"
                      height="8"
                      class="mb-4"
                    />
                    <span class="text-body-1">Progress: {{ course.progress }}%</span>
                  </div> -->

                  <!-- Action Buttons -->
                  <div class="d-flex flex-wrap gap-4 mb-4">
                    <VBtn :variant="course.can_redirect ? 'elevated' : 'elevated'"
                      :color="course.can_redirect ? 'primary' : 'secondary'" class="flex-grow-1"
                      :disabled="!course.can_redirect" @click="goToCourse(course)">
                      {{ course.can_redirect ? $t('academy.viewCourse') : $t(`enrollment.${course.enrollment_status}`)
                      }}
                    </VBtn>
                  </div>

                  <div class="d-flex flex-wrap gap-4">
                    <!-- ▶︎ Start Exam button (only if exams exist) -->
                    <template v-for="exam in examsByCourse[course.id] || []" :key="exam.id">
                      <VBtn :color="isExamAvailable(exam) ? 'success' : 'secondary'" :outlined="!isExamAvailable(exam)"
                        :disabled="!isExamAvailable(exam)" @click="onStartExam(exam)">
                        {{ exam.name }}
                      </VBtn>
                    </template>
                  </div>
                </VCardText>
              </VCard>
            </VCol>
          </template>
        </VRow>

        <!-- exam dialog -->
        <VDialog v-model="isExamDialog" :width="'75%'" persistent>
          <LmsExamAttempt v-if="selectedExamId" :exam-id="selectedExamId" @close="isExamDialog = false" />
        </VDialog>

      </div>
      <div v-else>
        <h4 class="text-h4 text-center mb-6">{{ $t('academy.noCourseFound') }}</h4>
      </div>
      <VPagination v-model="page" rounded color="primary" :length="Math.ceil(totalCourses / itemsPerPage)" />
    </VCardText>
  </VCard>
</template>

<style scoped>
/* Custom styles for the student course dashboard */
.course-title {
  color: inherit;
  text-decoration: none;
}
</style>
