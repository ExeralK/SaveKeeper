import { ipcMain, dialog } from "electron";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import yauzl from "yauzl";

ipcMain.handle("select-file", async (event) => {
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ["openFile"],
    });

    if (canceled || filePaths.length === 0) {
      return { success: false, error: "File selection canceled" };
    }

    const filePath = filePaths[0];
    const content = fs.readFileSync(filePath, "utf-8");

    return { success: true, content, filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("select-folder", async (event) => {
  try {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });

    if (!result.canceled && result.filePaths.length > 0) {
      return { success: true, folderPath: result.filePaths[0] };
    } else {
      return { success: false, error: "Folder selection was canceled" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("delete-file", async (event, { filePath }) => {
  try {
    await fs.promises.unlink(filePath);
    console.log("File deleted successfully");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete file:", error.message);
    return { success: false, error: error.message };
  }
});

const unlinkAsync = promisify(fs.unlink);
const rmdirAsync = promisify(fs.rmdir);

async function removePath(targetPath: string) {
  const stats = fs.lstatSync(targetPath);

  if (stats.isDirectory()) {
    const files = fs.readdirSync(targetPath);

    for (const file of files) {
      const filePath = path.join(targetPath, file);
      await removePath(filePath);
    }

    await rmdirAsync(targetPath);
  } else {
    await unlinkAsync(targetPath);
  }
}

ipcMain.handle("replace-file", async (event, { targetPath, backupPath }) => {
  try {
    // Remove the target file or folder
    await removePath(targetPath);

    // Create the target folder
    await fs.promises.mkdir(targetPath, { recursive: true });

    // Extract the compressed backup file to the target folder
    return new Promise((resolve, reject) => {
      yauzl.open(backupPath, { lazyEntries: true }, (err, zipfile) => {
        if (err) reject({ success: false, error: err.message });

        zipfile.readEntry();
        zipfile.on("entry", (entry) => {
          const filePath = path.join(targetPath, entry.fileName);
          const fileDir = path.dirname(filePath);

          zipfile.openReadStream(entry, (err, readStream) => {
            if (err) throw err;

            // Create the necessary directories
            fs.promises.mkdir(fileDir, { recursive: true }).then(() => {
              readStream.on("end", () => {
                zipfile.readEntry();
              });

              // Write the file
              readStream.pipe(fs.createWriteStream(filePath));
            });
          });
        });

        zipfile.on("end", () => {
          resolve({ success: true });
        });

        zipfile.on("error", (err) => {
          reject({ success: false, error: err.message });
        });
      });
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
});
