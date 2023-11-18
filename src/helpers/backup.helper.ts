import path from "path";
import fs from "fs";
import archiver from "archiver";
import { getCurrentDateTimeString } from "./date.helper";
import klawSync from "klaw-sync";

class BackupHelper {
  static getFullFileName(name: string = "Test", filePath: string = ""): string {
    const currentDateString = getCurrentDateTimeString();
    const fileNameWithDate = `${name}_${currentDateString}${path.extname(
      filePath
    )}`;

    return fileNameWithDate;
  }

  static async createBackupFile(
    fileName: string = "",
    filePath: string = "",
    backupPath: string = ""
  ) {
    try {
      const zipPath = path.join(backupPath, `${fileName}.zip`);
      const output = fs.createWriteStream(zipPath);
      const archive = archiver("zip", {
        zlib: { level: 9 }, // Sets the compression level.
      });

      archive.on("warning", function (err: any) {
        if (err.code === "ENOENT") {
          console.warn(err);
        } else {
          throw err;
        }
      });

      archive.on("error", function (err: any) {
        throw err;
      });

      archive.pipe(output);

      // Check if the selected path is a directory
      const stats = fs.lstatSync(filePath);
      if (stats.isDirectory()) {
        // Recursively add files and folders to the archive
        const items = klawSync(filePath, { nodir: false });
        items.forEach((item: any) => {
          const relativePath = path.relative(filePath, item.path);
          if (item.stats.isFile()) {
            archive.file(item.path, { name: relativePath });
          } else if (item.stats.isDirectory()) {
            archive.directory(item.path, relativePath);
          }
        });
      } else {
        archive.file(filePath, { name: path.basename(filePath) });
      }

      await archive.finalize();

      console.log("Backup successful");
      return { success: true };
    } catch (error) {
      console.error("Backup failed:", error.message);
      return { success: false, error: error.message };
    }
  }

  static async getBackupFiles(backupPath: string = "") {
    try {
      const files = await fs.promises.readdir(backupPath);
      const backupFiles = files.map((file) => {
        const filePath = path.join(backupPath, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          path: filePath,
          size: stats.size,
          mtime: stats.mtime,
        };
      });
      return { success: true, backupFiles };
    } catch (error) {
      console.error("Error reading backup files:", error);
      return { success: false, error: "Error reading backup files" };
    }
  }
}

export default BackupHelper;
