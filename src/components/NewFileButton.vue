<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "NewFileButton",
});
</script>

<template>
	<button @click="$emit('new-file')" class="button is-primary new-file-btn">
		New File
	</button>
</template>
