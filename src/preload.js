// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";


const openFile = () => {
  return ipcRenderer.invoke("file:read");
}

const saveFile = () => {
  return ipcRenderer.invoke('file:save');
}


contextBridge.exposeInMainWorld('fileApi', {
  open: openFile,
  save: saveFile,
})

