<script setup lang="ts">
import WelcomeScreen from "./components/WelcomeScreen.vue";

window.api.on("file:opened", (_err: any, content: any, path: string) => {
	console.log(content);
	console.log("----------");
	console.log(path);
});
</script>

<template>
	<WelcomeScreen />
</template>

<style></style>
