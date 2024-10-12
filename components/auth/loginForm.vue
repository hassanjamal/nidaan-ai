<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div class="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 class="text-2xl font-bold mb-4 text-center">Login</h2>

            <input v-model="username" type="text" placeholder="Enter Username"
                class="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <input v-model="password" type="password" placeholder="Enter Password"
                class="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" />

            <button @click="login" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Login
            </button>

            <p v-if="errorMessage" class="mt-4 text-red-500 text-center">{{ errorMessage }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import PouchDB from 'pouchdb';
import { centralDb } from '@/scripts/db/dbConfig.js';

const username = ref('');
const password = ref('');
const errorMessage = ref('');

const login = async () => {
    const isActivated = await electronAPI.getPouchDBName();
    let db;

    if (isActivated) {
        db = new PouchDB(isActivated);
    } else {
        db = centralDb;
    }

    try {
        const result = await db.find({
            selector: { username: username.value, password: password.value },
        });

        if (result.docs.length > 0) {
            emit('login', isActivated);
        } else {
            errorMessage.value = 'Invalid credentials.';
        }
    } catch (error) {
        errorMessage.value = 'Login failed. Please try again.';
        console.error('Login error:', error);
    }
};
</script>
