<template>
    <header class="bg-blue-600 text-white py-4 shadow-md">
        <div class="container mx-auto flex justify-between items-center px-6">
            <h1 class="text-2xl font-bold">Medicine ERP</h1>

        </div>
    </header>
</template>

<script setup>
import { useRouter } from '#app';
const router = useRouter();
const logout = () => {
    alert('Logged out successfully!');
    router.push('/'); // Redirect to login page or home
};
</script>
<style scoped>
/* Add any additional styles if necessary */
</style>
