const { marked } = require('marked');


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
})
