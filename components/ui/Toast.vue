<template>
    <transition name="fade">
        <div v-if="visible"
            class="fixed top-5 right-5 max-w-sm w-full bg-white border rounded-lg shadow-lg p-4 flex flex-col space-y-2"
            :class="typeClass">
            <button @click="hideToast" class="ml-auto p-1 rounded-full bg-gray-100 hover:bg-gray-200">
                ✕
            </button>

            <div class="flex-1">
                <p class="font-medium text-lg">{{ title }}</p>
                <p class="text-sm text-gray-600">{{ message }}</p>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';

const props = defineProps({
    title: String,
    message: String,
    type: {
        type: String,
        default: 'info',
    },
    duration: {
        type: Number,
        default: 3000, // Default 3 seconds duration
    },
    show: Boolean, // Trigger toast visibility
});

const visible = ref(false);

const typeClass = computed(() => {
    switch (props.type) {
        case 'success':
            return 'bg-green-100 border-green-400 text-green-700';
        case 'error':
            return 'bg-red-100 border-red-400 text-red-700';
        case 'info':
        default:
            return 'bg-blue-100 border-blue-400 text-blue-700';
    }
});

const showToast = () => {
    visible.value = false; // Reset visibility before showing again
    setTimeout(() => (visible.value = true), 10); // Trigger reactivity
    setTimeout(hideToast, props.duration); // Auto-hide after duration
};

const hideToast = () => {
    visible.value = false;
};

watchEffect(() => {
    if (props.show) {
        showToast();
    }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
