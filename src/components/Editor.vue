<template>
	<button class="back button is-link">x</button>
	<textarea
		name="markdown"
		id="md"
		rows="20"
		cols="100"
		v-model="editorText"
	></textarea>
</template>

<script setup lang="ts">
import { ref, computed, toRefs } from "vue";
const props = defineProps({ editorText: String });
</script>

<style scoped>
textarea {
	max-width: 95%;
	resize: vertical;
}
</style>
