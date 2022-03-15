<script lang="ts">
import { defineComponent } from "vue";
import Header from "./Layout/Header.vue";
import NewFileButton from "./NewFileButton.vue";

export default defineComponent({
	name: "WelcomeScreen",
	components: { Header, NewFileButton },
	methods: {
		createNewFile(fileName: string) {
			// @ts-expect-error
			window.api.send("file:new", fileName);
		},
	},
});
</script>

<template>
	<div class="header">
		<Header />
	</div>
	<div class="buttons">
		<NewFileButton v-on:new-file="createNewFile('Untitled')" class="btn" />
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
