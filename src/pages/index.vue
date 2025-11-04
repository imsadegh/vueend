<script setup lang="ts">
import { useCookie } from '#app'
import { useRouter } from 'vue-router'

definePage({
  meta: {
    layout: 'blank',
    public: true,
  },
})

const router = useRouter()
const userData = useCookie('userData')
const isLoggedIn = !!(userData.value)

// Auto-redirect logged-in users to their dashboard
if (isLoggedIn) {
  const role = userData.value?.role
  if (role === 'admin')
    router.push({ name: 'dashboards-lms-admin' })
  else if (role === 'student')
    router.push({ name: 'dashboards-academy' })
  else if (role === 'instructor')
    router.push({ name: 'dashboards-lms-instructor' })
}
</script>

<template>
  <div class="landing-page">
    <div
      class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 text-white px-4">
      <!-- Hero Section -->
      <div class="text-center max-w-2xl mx-auto mb-12">
        <h1 class="text-5xl md:text-6xl font-bold mb-6">
          Welcome to Hakim Yar
        </h1>
        <p class="text-xl md:text-2xl mb-8 opacity-90">
          Your Learning Management System for Excellence in Education
        </p>
        <p class="text-lg opacity-80 mb-12">
          Connect, learn, and grow with our comprehensive platform designed for students, instructors, and
          administrators.
        </p>
      </div>

      <!-- Call-to-Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <router-link :to="{ name: 'login' }"
          class="px-8 py-3 bg-white text-primary-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 text-center">
          Login
        </router-link>
        <router-link :to="{ name: 'register' }"
          class="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-700 transition-colors duration-200 text-center">
          Sign Up
        </router-link>
      </div>

      <!-- Features Section -->
      <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
        <!-- Feature 1 -->
        <div class="text-center">
          <div class="text-4xl mb-4">📚</div>
          <h3 class="text-xl font-semibold mb-2">Interactive Learning</h3>
          <p class="opacity-80">
            Engage with course materials, videos, and assignments designed for effective learning.
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="text-center">
          <div class="text-4xl mb-4">👨‍🏫</div>
          <h3 class="text-xl font-semibold mb-2">Expert Instructors</h3>
          <p class="opacity-80">
            Learn from experienced educators dedicated to your success.
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="text-center">
          <div class="text-4xl mb-4">📊</div>
          <h3 class="text-xl font-semibold mb-2">Progress Tracking</h3>
          <p class="opacity-80">
            Monitor your progress and achieve your learning goals.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing-page {
  inline-size: 100%;
}
</style>
