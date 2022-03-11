<script lang="ts">
import { defineComponent } from "vue";
import Header from "./Layout/Header.vue";

export default defineComponent({
	name: "WelcomeScreen",
	components: { Header },
});
</script>

<template>
	<Header appName="Dropnote" />
</template>
