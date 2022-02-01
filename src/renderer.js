const { ipcRenderer } = require("electron");
const path = require("path");

// HTML Elements
const newFileButton = document.querySelector(".new-file-btn");
const openFileButton = document.querySelector(".open-file-btn");
const saveFileButton = document.querySelector(".save-file-btn");

const markdownView = document.querySelector("#markdown");
const markdownDiv = document.querySelector(".markdown-div");
const htmlView = document.querySelector("#html");

let filePath = null;
let originalContent = "";

// SimpleMDE configuration.
// Markdown editor
var editor = new SimpleMDE({
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

function updateUI(isEdited) {
	let title = "Drop Note";

	// Update the title of the application.
	if (filePath !== null) {
		title = `${path.basename(filePath)} - ${title}`;
	}
	if (isEdited) {
		title = "● " + title;
		saveFileButton.disabled = false;
	} else if (!isEdited) {
    title = "Drop Note";
		if (filePath !== null) {
			title = `${path.basename(filePath)} + Drop Note`;
		}
	}

	ipcRenderer.send("update-title", title);
}

openFileButton.addEventListener("click", () => {
	ipcRenderer.send("open-file");
});

newFileButton.addEventListener("click", () => {
	if (editor.value().toString() !== "") {
		ipcRenderer.send("create-new-file", "non-empty");
		ipcRenderer.on("new-file:accepted", (event, msg) => {
      filePath = null;
			updateUI(false);
			editor.value("");
		});
	}
});

saveFileButton.addEventListener("click", () => {
	ipcRenderer.send("save-file", filePath, editor.value());
});

ipcRenderer.on("opened-file", (event, content, file) => {
	filePath = file;
	originalContent = content;

	updateUI();
	editor.value(content);
});

ipcRenderer.on("saved-file", (event) => {
	updateUI(false);
});
