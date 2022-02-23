<template>
	<textarea name="markdown" id="md" v-model="editorText"></textarea>
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
