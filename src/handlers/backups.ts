// src/main/ipcHandlers.ts
import { ipcMain } from "electron";
import { config } from "../config";
import BackupHelper from "../helpers/backup.helper";

let backupTasks: { [key: number]: NodeJS.Timeout } = {};

ipcMain.handle(
  "start-backup",
  async (event, { id, name, filePath, backupPath }) => {
    const { getFullFileName, createBackupFile } = BackupHelper;

    const runBackup = async () => {
      const fileName = getFullFileName(name, filePath);
      return await createBackupFile(fileName, filePath, backupPath);
    };

    const result = await runBackup();

    if (result.success) {
      const backupInterval = config.backupTimeInMinutes * 60 * 1000;

      backupTasks[id] = setInterval(async () => {
        await runBackup();
      }, backupInterval);
    }

    return result;
  }
);

ipcMain.handle("stop-backup", (event, { id }) => {
  if (backupTasks[id]) {
    clearInterval(backupTasks[id]);
    delete backupTasks[id];
    console.log("Backup task stopped successfully");
    return { success: true };
  } else {
    console.error("Backup task not found");
    return { success: false, error: "Backup task not found" };
  }
});

ipcMain.handle("show-backups", (event, { backupPath }) => {
  console.log(backupPath);
  return BackupHelper.getBackupFiles(backupPath);
});
