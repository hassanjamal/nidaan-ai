<template>
    <div class="bg-neutral-100 min-h-screen flex flex-col">
        <LayoutHeader />
        <main class="flex-grow">
            <slot /> <!-- This will render the active page -->
        </main>
        <LayoutFooter />
    </div>
</template>

<script setup>
import LayoutHeader from '@/components/layout/LayoutHeader.vue';
import LayoutFooter from '@/components/layout/LayoutFooter.vue';
</script>

<style scoped>
</style>
