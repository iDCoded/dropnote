<template>
	<img alt="Vue logo" src="./assets/logo.png" />
	<img
		src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/electron/electron-original.svg"
		height="200"
		width="200"
	/>
	<HelloWorld msg="Welcome to Your Vue.js + Electron + TypeScript App" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorld from "./components/HelloWorld.vue";

export default defineComponent({
	name: "App",
	components: {
		HelloWorld,
	},
});
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
