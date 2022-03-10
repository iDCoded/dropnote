<template>
	<h2 class="name">{{ appName }}</h2>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "Header",
	props: {
		appName: String,
	},
});
</script>

<style scoped>
.name {
	text-align: center;
}
</style>
