<template>
	<h1>Welcome to</h1>
	<h1>Drop Note</h1>
	<NewFileButton @click="$emit('create-new-file', fileName)" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NewFileButton from "./Buttons/NewFileButton.vue";

export default defineComponent({
	name: "WelcomeScreen",
	components: {
		NewFileButton,
	},
	data: () => {
		return {
			fileName: "New File",
		};
	},
});
</script>
