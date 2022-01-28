const { marked } = require('marked');
const { ipcRenderer } = require('electron');

// HTML Elements
const newFileButton = document.querySelector('.new-file-button');
const openFileButton = document.querySelector('.open-file-btn');
const saveFileButton = document.querySelector('.save-file-btn');

const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');

const renderMarkdownToHtml = (markdown) => {
    htmlView.innerHTML = marked(markdown)
};


markdownView.addEventListener('keyup', (event) => {
    const currentContent = event.target.value;
    renderMarkdownToHtml(currentContent);
});

openFileButton.addEventListener('click', () => {
    console.log('Open file clicked');
    ipcRenderer.send('open-file');
    console.log('Opened the file successfully.');
});

ipcRenderer.on('file-opened', (event, file, content) => {
    console.log('Content received = ' + content);
    console.log('File received = ' + file);
});
