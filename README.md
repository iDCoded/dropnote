# Drop Note

---

## Project Structure

```
.
├── out/
│   └── ** OUTPUT OF TypeScript FILES **
├── public/
│   ├── favicon.ico
│   └── index.html                         // Main Index HTML File
├── src/
│   ├── assets/
│   │   └── ** ALL REQUIRED ASSETS **
│   ├── components/
│   │   └── ** ALL VUE COMPONENTS **
│   ├── App.vue                            // Vue App Component
│   └── main.ts                            // Main Vue File
├── .browserslistrc
├── .gitignore
├── app.ts                                 // Electron Main Process
├── babel.config.js
├── index.ts                               // Electron Render Process
├── package.json
├── package-lock.json
├── preload.ts                             // Electron preload script
├── README.md
├── tsconfig.json                          // TypeScript Configuration
└── vue.config.js                          // Vue Configuration
```

## Project setup

### Clone the repository

```shell
git clone https://github.com/iDCoded/Drop-Note.git
cd Drop-Note
```

### Install all dependencies

```shell
npm install
```

### Compiles and hot-reloads for development

```shell
npm run serve
```

### Compiles and minifies for production

```shell
npm run build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
