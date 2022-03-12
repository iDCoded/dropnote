<script lang="ts">
import { defineComponent } from "vue";
import Header from "./Layout/Header.vue";
import NewFileButton from "./NewFileButton.vue";

export default defineComponent({
	name: "WelcomeScreen",
	components: { Header, NewFileButton },
	methods: {
		newFile() {
			console.log("Created new file");
		},
	},
});
</script>

<template>
	<Header />
	<NewFileButton v-on:new-file="newFile" />
</template>
