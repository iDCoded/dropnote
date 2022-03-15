<script lang="ts">
import { defineComponent } from "vue";
import Header from "./Layout/Header.vue";
import NewFileButton from "./OpenFileButton.vue";

export default defineComponent({
	name: "WelcomeScreen",
	components: { Header, NewFileButton },
	methods: {
		openFile(fileName: string) {
			// @ts-expect-error
			window.api.send("file:open", fileName);
		},
	},
});
</script>

<template>
	<div class="header">
		<Header />
	</div>
	<div class="buttons">
		<NewFileButton v-on:open-file="openFile('Untitled')" class="btn" />
	</div>
</template>

<style scoped>
.header {
	padding-top: 60px;
}
.buttons {
	padding-top: 40px;
	font-family: "Noto Sans", sans-serif;
	display: flex;
	justify-content: center;
	align-content: center;
}
</style>
