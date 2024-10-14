<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded shadow-md">
            <h2 class="text-xl font-bold mb-4">Enter Store Activation Key</h2>
            <input v-model="enteredKey" type="text" class="border p-2 w-full" placeholder="Enter your activation key" />
            <button @click="activate" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                Activate
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const enteredKey = ref('');

const activate = async () => {
    const success = await window.electronAPI.verifyKey(enteredKey.value);
    if (success) {
        alert('App Activated Successfully!');
        $emit('activate', true);
    } else {
        alert('Invalid Key. Please try again.');
    }
};
</script>
