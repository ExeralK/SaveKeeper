// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// src/preload/preload.ts

// src/preload/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld("electron", {
  startBackup: async (payload: {
    id: number;
    filePath: string;
    backupPath: string;
  }) => {
    return await ipcRenderer.invoke("start-backup", payload);
  },
  stopBackup: async (payload: { id: number }) => {
    return await ipcRenderer.invoke("stop-backup", payload);
  },
  selectFile: async () => {
    return await ipcRenderer.invoke("select-file");
  },
  selectFolder: async () => {
    return await ipcRenderer.invoke("select-folder");
  },
  replaceFile: async (payload: { targetPath: string; backupPath: string }) => {
    return await ipcRenderer.invoke("replace-file", payload);
  },
  deleteFile: async (payload: { filePath: string }) => {
    return await ipcRenderer.invoke("delete-file", payload);
  },
  showBackups: async (payload: { backupPath: string }) => {
    return await ipcRenderer.invoke("show-backups", payload);
  },
});

