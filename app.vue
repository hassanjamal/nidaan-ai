<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <login-form v-if="!loggedIn" @login="handleLogin" />
    <NuxtPage v-if="loggedIn" /> <!-- This is the correct way to render pages -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LoginForm from '@/components/auth/loginForm.vue';
import { useRouter } from '#app';

const loggedIn = ref(false);
const router = useRouter();

onMounted(async () => {
  try {
    const pouchDBName = await window.electronAPI.getPouchDBName(); // Check activation
    if (pouchDBName) {
      loggedIn.value = true;
      router.push('/'); // Redirect to index page
    }
  } catch (error) {
    console.error('Error accessing Electron API:', error);
  }
});

const handleLogin = () => {
  loggedIn.value = true;
  router.push('/'); // Redirect to index.vue after login
};
</script>
