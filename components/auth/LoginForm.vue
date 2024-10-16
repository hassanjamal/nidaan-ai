<template>
    <div class="w-full max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 class="text-xl font-bold mb-4">Login</h2>
        <form @submit.prevent="handleLogin">
            <div class="mb-4">
                <label class="block text-gray-700 font-medium mb-2">Username</label>
                <input type="text" v-model="username"
                    class="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your username" />
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 font-medium mb-2">Password</label>
                <input type="password" v-model="password"
                    class="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password" />
            </div>
            <button type="submit" class="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">
                Login
            </button>
        </form>

        <Toast :title="toastTitle" :message="toastMessage" :type="toastType" :show="toastVisible" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Toast from '@/components/ui/Toast.vue';

const username = ref('');
const password = ref('');
const toastVisible = ref(false);
const toastTitle = ref('');
const toastMessage = ref('');
const toastType = ref('info');

const handleLogin = async () => {
    if (username.value === 'admin' && password.value === 'password') {
        // Successful login
        showToast('Success', 'Logged in successfully!', 'success');
    } else {
        // Failed login
        showToast('Error', 'Invalid credentials. Please try again.', 'error');
    }
};

const showToast = (title, message, type) => {
    toastTitle.value = title;
    toastMessage.value = message;
    toastType.value = type;
    toastVisible.value = true;
};
</script>
