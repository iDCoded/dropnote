/*-----------------------------------------------*
 *                 Dropnote                      *
 *               By : Dhruv Anand 	             *
 *            Electron Prerload Script           *
 *                                               *
 ------------------------------------------------*/

const { contextBridge, ipcRenderer } = require("electron");
const API = {
	send: (channel, data) => {
		ipcRenderer.send(channel, data);
	},
};
contextBridge.exposeInMainWorld("api", API);
