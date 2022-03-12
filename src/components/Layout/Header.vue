<template>
	<h2 class="name">Dropnote</h2>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "Header",
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap");
.name {
	text-align: center;
	font-family: "Noto Sans", sans-serif;
}
</style>
