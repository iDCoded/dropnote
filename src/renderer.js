const { ipcRenderer } = require("electron");

// HTML Elements
const newFileButton = document.querySelector(".new-file-button");
const openFileButton = document.querySelector(".open-file-btn");
const saveFileButton = document.querySelector(".save-file-btn");

const markdownView = document.querySelector("#markdown");
const markdownDiv = document.querySelector(".markdown-div");
const htmlView = document.querySelector("#html");

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

//markdownDiv.addEventListener('keyup', () => {
  //console.log(editor.value().toString());
//});

editor.codemirror.on('change', () => {
  console.log(editor.value().toString());
});

openFileButton.addEventListener('click', () => {
  ipcRenderer.send('open-file');
})

ipcRenderer.on('opened-file', (event, content) => {
  console.log('File content is ->' + content);
})
