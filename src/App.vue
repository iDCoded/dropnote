<script setup lang="ts">
import Header from "./components/Layout/Header.vue";
import WelcomeScreen from "./components/WelcomeScreen.vue";

window.api.on("file:opened", (err, content, path) => {
	console.log(content);
	console.log("----------");
	console.log(path);
});
</script>

<template>
	<WelcomeScreen />
</template>

<style></style>
