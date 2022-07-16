"use strict";
const { ipcRenderer } = require("electron");
const path = require("path");
const { config } = require("./MdeConfig");
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
// @ts-ignore: Cannot find name 'SimpleMDE'
var editor = new SimpleMDE(config);
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
        // @ts-ignore: Object is possibly 'null'
        saveFileButton.disabled = false;
    }
    else if (!isEdited) {
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
        ipcRenderer.on("new-file:accepted", (event, msg) => {
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
