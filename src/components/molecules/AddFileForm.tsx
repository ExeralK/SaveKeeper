import * as React from "react";
import { useState } from "react";
import { FileItem, AddFileFormProps } from "../../interfaces";
import "../../scss/AddFileForm.scss";

const AddFileForm: React.FC<AddFileFormProps> = ({ onFileSubmit }) => {
  const [fileName, setFileName] = useState("");
  const [filePath, setFilePath] = useState("");
  const [backupPath, setBackupPath] = useState("");
  const { electron } = window as any;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!fileName || !filePath || !backupPath) {
      alert("Please fill in all fields.");
      return;
    }

    const newFile: FileItem = {
      id: Date.now(),
      name: fileName,
      filePath: filePath,
      backupPath: backupPath,
      backupStatus: false,
    };

    onFileSubmit(newFile);

    setFileName("");
    setFilePath("");
    setBackupPath("");
  };

  const openFileDialog = async (
    setPath: React.Dispatch<React.SetStateAction<string>>,
    selectFolder: boolean = false
  ) => {
    const result = selectFolder
      ? await electron.selectFolder()
      : await electron.selectFile();
    const { success, error, filePath, folderPath } = result;

    if (success) {
      console.log("Path:", selectFolder ? folderPath : filePath);
      setPath(selectFolder ? folderPath : filePath);
    } else {
      console.log("Failed to get the file path: ", error);
    }
  };

  return (
    <form className="add-file-form" onSubmit={handleSubmit}>
      <label htmlFor="file-name">File Name:</label>
      <input
        type="text"
        id="file-name"
        value={fileName}
        placeholder="Enter a name for the file"
        onChange={(e) => setFileName(e.target.value)}
      />

      <label htmlFor="file-path">File Path:</label>
      <input
        type="text"
        id="file-path"
        value={filePath}
        placeholder="Choose a folder"
        readOnly
        onClick={() => openFileDialog(setFilePath, true)}
      />

      <label htmlFor="backup-path">Backup Destination:</label>
      <input
        type="text"
        id="backup-path"
        value={backupPath}
        placeholder="Choose a backup destination"
        readOnly
        onClick={() => openFileDialog(setBackupPath, true)}
      />

      <button type="submit">Add File</button>
    </form>
  );
};

export default AddFileForm;
