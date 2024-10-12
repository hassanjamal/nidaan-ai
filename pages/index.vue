<template>
    <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div v-if="syncInProgress" class="bg-yellow-100 p-4 rounded-md shadow-md mb-4">
            <p class="text-yellow-800 font-semibold">Sync in progress... Please wait.</p>
        </div>

        <div v-if="!syncInProgress" class="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 class="text-2xl font-bold mb-4 text-center">Store Information</h2>
            <p><strong>Store Name:</strong> {{ storeName }}</p>
            <p><strong>Address:</strong> {{ storeAddress }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PouchDB from 'pouchdb';

const storeName = ref('');
const storeAddress = ref('');
const syncInProgress = ref(true); // Default to true, assumes sync is in progress

onMounted(async () => {
    const pouchDBName = await window.electronAPI.getPouchDBName();
    const localDb = new PouchDB(pouchDBName);

    try {
        const result = await localDb.find({ selector: { type: 'store' } });
        if (result.docs.length > 0) {
            storeName.value = result.docs[0].name;
            storeAddress.value = result.docs[0].address;
            syncInProgress.value = false; // Sync complete
        }
    } catch (error) {
        console.error('Error fetching store info:', error);
    }
});
</script>
