<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 class="text-2xl font-bold mb-4 text-center">Activate Store</h2>
            <p class="mb-4">Please enter the activation key:</p>

            <input v-model="activationKey" type="text" placeholder="Enter Activation Key"
                class="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />

            <button @click="activateStore"
                class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Activate
            </button>

            <p v-if="errorMessage" class="mt-4 text-red-500 text-center">{{ errorMessage }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const activationKey = ref('');
const errorMessage = ref('');

const activateStore = async () => {
    const installationId = await window.electronAPI.getInstallationId();

    const success = await electronAPI.verifyKey(activationKey.value, installationId);
    if (success) {
        emit('activate', true); // Emit activation success to App.vue
    } else {
        errorMessage.value = 'Invalid activation key. Please try again.';
    }
};
</script>
