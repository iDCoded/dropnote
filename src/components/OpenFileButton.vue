<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "OpenFileButton",
});
</script>

<template>
	<button @click="$emit('open-file')" class="button is-primary new-file-btn">
		Open File
	</button>
</template>
