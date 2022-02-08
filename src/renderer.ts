const { ipcRenderer } = require("electron");
const path = require("path");

// HTML Elements
const newFileButton: HTMLInputElement | null =
	document.querySelector(".new-file-btn");
const openFileButton: HTMLInputElement | null =
	document.querySelector(".open-file-btn");
const saveFileButton: HTMLInputElement | null =
	document.querySelector(".save-file-btn");

const markdownView = document.querySelector("#markdown")
const markdownDiv = document.querySelector(".markdown-div");
const htmlView = document.querySelector("#html");

let filePath: String | null = null;
let originalContent = "";

// SimpleMDE configuration.
// Markdown editor
// @ts-ignore: Cannot find name 'SimpleMDE'
var editor: SimpleMDE = new SimpleMDE({
	autofocus: true,
	element: document.querySelector("#markdown"),
	forceSync: true,
	hideIcons: ["guide", "heading"],
	indentWithTabs: true,
	initialValue: "# Hello world!",
	insertTexts: {
		horizontalRule: ["", "\n\n-----\n\n"],
		image: ["![](http://", ")"],
		link: ["[", "](http://)"],
		table: [
			"",
			"\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text      | Text     |\n\n",
		],
	},
	lineWrapping: false,
	parsingConfig: {
		allowAtxHeaderWithoutSpace: true,
		strikethrough: false,
		underscoresBreakWords: true,
	},
	placeholder: "Start typing...",
	promptURLs: true,
	renderingConfig: {
		singleLineBreaks: false,
		codeSyntaxHighlighting: true,
	},
	shortcuts: {
		drawTable: "Cmd-Alt-T",
	},
	showIcons: ["code", "table"],
	spellChecker: false,
	styleSelectedText: false,
	tabSize: 4,
});

editor.codemirror.on("change", () => {
	updateUI(true);
});

function updateUI(isEdited?: boolean) {
	let title = "Drop Note";

	// Update the title of the application.
	if (filePath !== null) {
		title = `${path.basename(filePath)} - ${title}`;
	}
	if (isEdited) {
		title = "● " + title;
		// @ts-ignore: Object is possibly 'null'
		saveFileButton.disabled = false;
	} else if (!isEdited) {
		title = "Drop Note";
		if (filePath !== null) {
			title = `${path.basename(filePath)} + Drop Note`;
		}
	}

	ipcRenderer.send("update-title", title);
}
// @ts-ignore: Object is possibly 'null'
openFileButton.addEventListener("click", () => {
	ipcRenderer.send("open-file");
});
// @ts-ignore: Object is possibly 'null'
newFileButton.addEventListener("click", () => {
	if (editor.value().toString() !== "") {
		ipcRenderer.send("create-new-file", "non-empty");
		ipcRenderer.on("new-file:accepted", (event: Electron.IpcRendererEvent, msg: String) => {
			filePath = null;
			updateUI(false);
			editor.value("");
		});
	}
});
// @ts-ignore: Object is possibly 'null'
saveFileButton.addEventListener("click", () => {
	ipcRenderer.send("save-file", filePath, editor.value());
});

ipcRenderer.on("opened-file", (event, content, file) => {
	filePath = file;
	originalContent = content;

	updateUI();
	editor.value(content);
});

ipcRenderer.on("create-new-file:app", (event) => {
	// @ts-ignore: Object is possibly 'null'
	newFileButton.click();
});

ipcRenderer.on("save-file:app", (event) => {
	// @ts-ignore: Object is possibly 'null'
	saveFileButton.click();
});

ipcRenderer.on("saved-file", (event) => {
	updateUI(false);
});
