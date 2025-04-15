<script setup lang="ts">
import { API_BASE_URL } from '@/config/config';
import axios from 'axios';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const token = useCookie('accessToken').value;

// Dialog state
const isDialogVisible = ref(false);

// Available courses for enrollment management
const availableCourses = ref<Array<{ id: number; course_name: string; tuition_fee?: number }>>([]);
const selectedCourseId = ref<number | null>(null);

// Enrollment data for the selected course
const enrollments = ref<any[]>([]);

// Table headers for the enrollments data table
const headers = ref([
  { title: $t('enrollment.studentName'), value: 'studentName', sortable: false },
  { title: $t('enrollment.status'), value: 'status', sortable: false },
  // { title: $t('enrollment.courseName'), value: 'courseName', sortable: false },
  { title: $t('enrollment.totalPaid'), value: 'total_paid', sortable: false },
  { title: $t('enrollment.coursePrice'), value: 'coursePrice', sortable: false },
  { title: $t('enrollment.remainPrice'), value: 'remainPrice', sortable: false },
  { title: $t('actions.actions'), value: 'actions', sortable: false },
]);

// Enrollment statuses options
const enrollmentStatuses = ref([
  { title: $t('enrollment.enrolled'), value: 'enrolled' },
  { title: $t('enrollment.waitlisted'), value: 'waitlisted' },
  { title: $t('enrollment.completed'), value: 'completed' },
  { title: $t('enrollment.dropped'), value: 'dropped' },
  { title: $t('enrollment.pending'), value: 'pending' },
]);

// Fetch the list of courses
const fetchAvailableCourses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/courses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    availableCourses.value = response.data;
  } catch (error) {
    console.error('Error fetching courses:', (error as any).response?.data || (error as any).message);
  }
};

// Fetch enrollments for the selected course
const fetchEnrollments = async () => {
  if (!selectedCourseId.value) return;
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/enrollments`, {
      params: { course_id: selectedCourseId.value },
      headers: { Authorization: `Bearer ${token}` },
    });
    // For inline editing, add an 'editedStatus' property for each enrollment.x
    enrollments.value = response.data.map((enrollment: any) => {
      const course = availableCourses.value.find(c => c.id === enrollment.course_id);
      return {
        ...enrollment,
        editedStatus: enrollment.status,
        // courseName: course ? course.course_name : 'N/A',
        coursePrice: course && course.tuition_fee ? course.tuition_fee : 0,
        remainPrice: course && course.tuition_fee ? course.tuition_fee - Number(enrollment.total_paid) : 0,
      };
    });

  } catch (error) {
    console.error('Error fetching enrollments:', (error as any).response?.data || (error as any).message);
  }
};

// Watch for changes in the selected course to fetch its enrollments
watch([selectedCourseId, isDialogVisible], ([courseId, dialogVisible]) => {
  if (dialogVisible) {
    fetchAvailableCourses();
  }
  if (courseId) {
    fetchEnrollments();
  }
});

// watch(isModuleDialogVisible, (visible) => {
//    if (visible) {
//      fetchCourses()
//        console.log('Module dialog opened')
//    }
//  })

// Update a single enrollment's status
const updateEnrollmentStatus = async (enrollment: any) => {
  try {
    await axios.put(
      `${API_BASE_URL}/admin/enrollments/${enrollment.id}`,
      { status: enrollment.editedStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // Update the enrollment's status locally after a successful update.
    enrollment.status = enrollment.editedStatus;
    console.log('Enrollment updated successfully.');
  } catch (error) {
    console.error('Error updating enrollment:', (error as any).response?.data || (error as any).message);
  }
};

// onMounted(() => {
//   fetchAvailableCourses();
//   console.log('meooow.');
// });
</script>

<template>
  <section>

    <VCard class="position-relative">
      <VCardText>
        <div class="mb-3">
          <h5 class="text-h5 text-wrap">
            {{ $t('manage') }}
            <strong>{{ $t('course.enroll') }}</strong>
            <!-- {{ $t('course.new') }} -->
            <span class="text-high-emphasis"> 👥</span>
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


        <!-- Button to open the Manage Enrollments dialog -->
        <VBtn color="primary" @click="isDialogVisible = true">
          {{ $t('View') }}
        </VBtn>

        <!-- Enrollment Management Dialog -->
        <VDialog v-model="isDialogVisible" max-width="900">
          <VCard>
            <VCardTitle>
              {{ $t('enrollment.manageEnrollments') }}
            </VCardTitle>
            <VCardText>
              <!-- Select Course Dropdown -->
              <VSelect v-model="selectedCourseId" :items="availableCourses" item-title="course_name" item-value="id"
                :label="$t('enrollment.selectCourse')" outlined clearable />

              <!-- Display enrollments only if a course is selected -->
              <div v-if="selectedCourseId">
                <VDataTable :headers="headers" :items="enrollments" class="mt-4" :items-length="enrollments.length">
                  <!-- Student Name Column -->
                  <template #item.studentName="{ item }">
                    <span>{{ item.student.first_name }} {{ item.student.last_name }}</span>
                  </template>
                  <!-- Status Column: Inline editable via VSelect -->
                  <template #item.status="{ item }">
                    <VSelect v-model="item.editedStatus" :items="enrollmentStatuses" item-title="title"
                      item-value="value" dense outlined />
                  </template>
                  <!-- Total Paid Column -->
                  <template #item.total_paid="{ item }">
                    <span>{{ new Intl.NumberFormat('en-US').format(item.total_paid) }} ریال</span>
                  </template>

                  <!-- Course Name Column -->
                  <!-- <template #item.courseName="{ item }">
                <span>{{ item.courseName }}</span>
              </template> -->

                  <!-- Remaining Price Column -->
                  <template #item.remainPrice="{ item }">
                    <span>{{ new Intl.NumberFormat('en-US').format(item.remainPrice) }} ریال</span>
                  </template>

                  <!-- Course Price Column -->
                  <template #item.coursePrice="{ item }">
                    <span>{{ new Intl.NumberFormat('en-US').format(item.coursePrice) }} ریال</span>
                  </template>

                  <!-- Actions Column: Update button -->
                  <template #item.actions="{ item }">
                    <VBtn color="primary" small @click="updateEnrollmentStatus(item)">
                      {{ $t('actions.update') }}
                    </VBtn>
                  </template>

                </VDataTable>
              </div>
            </VCardText>
            <VCardActions>
              <VBtn color="secondary" @click="isDialogVisible = false">
                {{ $t('button.close') }}
              </VBtn>
            </VCardActions>
          </VCard>
        </VDialog>

      </VCardText>

      <!-- Trophy -->
      <!-- <VImg :src="trophy" class="trophy flip-in-rtl" /> -->
    </VCard>
  </section>
</template>

<style scoped>
/* Add custom styles if needed */
</style>
