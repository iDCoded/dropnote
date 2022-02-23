<template>
	<WelcomeScreen
		v-if="!fileOpened"
		v-on:create-new-file="createNewFile"
		v-on:open-file="openFile"
	/>
	<Editor v-if="fileOpened" v-bind:editor-text="text" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WelcomeScreen from "./components/WelcomeScreen.vue";
import Editor from "./components/Editor.vue";
export default defineComponent({
	name: "App",
	data: () => {
		return {
			fileOpened: false,
			text: "",
			filePath: "",
		};
	},
	components: {
		WelcomeScreen,
		Editor,
	},
	methods: {
		createNewFile(fileName: string) {
			console.log("Created new file : " + fileName);
			ipcRenderer.send("app:create-new-file", fileName);
		},
		openFile() {
			ipcRenderer.send("app:open-file");
			ipcRenderer.on("opened-file", (e, content, filePath) => {
				this.fileOpened = true;
				this.text = content;
				this.filePath = filePath;
			});
		},
	},
});
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
