<template>
    <div class="container mx-auto p-6">
        <activation-modal v-if="showActivationModal" :visible="!isActivated" @activate="handleActivation" />

        <div v-if="!loggedIn">
            <login-form @login="handleLogin" />
        </div>

        <div v-if="loggedIn && storeInfo" class="text-center">
            <h1 class="text-2xl font-bold mb-4">Welcome to {{ storeInfo.name }}</h1>
            <p><strong>Address:</strong> {{ storeInfo.address }}</p>

            <p v-if="syncInProgress" class="text-yellow-600 mt-4">
                Sync in progress... Please wait.
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LoginForm from '~/components/auth/LoginForm.vue';
import ActivationModal from '~/components/auth/Activation.vue';
import PouchDB from 'pouchdb';

const showActivationModal = ref(false);
const isActivated = ref(false);
const loggedIn = ref(false);
const storeInfo = ref(null);
const syncInProgress = ref(true);

onMounted(async () => {
    try {
        const pouchDBName = await window.electronAPI.getPouchDBName();
        isActivated.value = !!pouchDBName;

        if (isActivated.value) {
            await loadStoreInfo(pouchDBName);
        } else {
            showActivationModal.value = true;
        }
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

const handleActivation = async (success) => {
    if (success) {
        isActivated.value = true;
        showActivationModal.value = false;
    }
};

const handleLogin = async () => {
    loggedIn.value = true;

    if (isActivated.value) {
        const pouchDBName = await window.electronAPI.getPouchDBName();
        await loadStoreInfo(pouchDBName);
    }
};

const loadStoreInfo = async (dbName) => {
    const localDb = new PouchDB(dbName);
    const result = await localDb.find({ selector: { type: 'store' } });

    if (result.docs.length > 0) {
        storeInfo.value = result.docs[0];
        syncInProgress.value = false; // Sync is complete
    }
};
</script>
