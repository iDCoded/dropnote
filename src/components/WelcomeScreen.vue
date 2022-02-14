<template>
	<h1>Welcome to</h1>
	<h1>Drop Note</h1>
	<div class="buttons">
		<NewFileButton @click="$emit('create-new-file', newFileName)" />
		<OpenFileButton @click="$emit('open-file')" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NewFileButton from "./Buttons/NewFileButton.vue";
import OpenFileButton from "./Buttons/OpenFileButton.vue";

export default defineComponent({
	name: "WelcomeScreen",
	components: {
		NewFileButton,
		OpenFileButton,
	},
	data: () => {
		return {
			newFileName: "New File",
		};
	},
});
</script>

<style scoped>
.buttons {
	display: flex;
	justify-content: center;
	padding: 12px;
}
</style>
