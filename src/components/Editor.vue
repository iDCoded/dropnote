<template>
	<textarea
		name="markdown"
		id="md"
		rows="20"
		cols="100"
		v-model="editorText"
	></textarea>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "Editor",
	props: {
		editorText: String,
	},
});
</script>

<style scoped>
textarea {
	max-width: 95%;
	resize: vertical;
}
</style>
