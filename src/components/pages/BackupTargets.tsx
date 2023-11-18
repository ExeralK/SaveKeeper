import React, { useState, useEffect } from "react";
import { FileItem } from "../../interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPlay, faStop, faTrash } from "@fortawesome/free-solid-svg-icons";
import AddFileForm from "../molecules/AddFileForm";
import Modal from "../molecules/Modal";
import "../../scss/BackupTargets.scss";

const BackupTargets: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { electron } = window as any;

  useEffect(() => {
    const savedFiles = localStorage.getItem("files");
    if (savedFiles) {
      const parsedFiles: FileItem[] = JSON.parse(savedFiles);
    
      setFiles(parsedFiles);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("files", JSON.stringify(files));
  }, [files]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleFileSubmit = (newFile: FileItem) => {
    setFiles([...files, newFile]);
  };

  const handleRemoveFile = (id: number) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  const handleBackup = async (id: number, backupPath: string) => {
    const file = files.find((f) => f.id === id);

    if (file) {
      const { success, error } = await electron.startBackup({
        id,
        name: file.name,
        filePath: file.filePath,
        backupPath,
      });

      if (success) {
        console.log("Backup successful");
      } else {
        console.error("Backup failed:", error);
      }

      setFiles(
        files.map((f) =>
          f.id === id ? { ...f, backupStatus: success ? true : false } : f
        )
      );
    }
  };

  const handleStop = async (id: number) => {
    const file = files.find((f) => f.id === id);

    if (file && file.backupStatus) {
      const { success, error } = await electron.stopBackup({ id });
      if (success) {
        console.log("Backup stopped");
      } else {
        console.error("Failed to stop backup:", error);
      }

      setFiles(
        files.map((f) => (f.id === id ? { ...f, backupStatus: false } : f))
      );
    }
  };

  return (
    <div className="backup-targets">
      <div className="backup-targets-header">
        <h2 className="backup-targets-heading">Tracked Files</h2>

        <button className="add-file-btn" onClick={toggleModal}>
          <FontAwesomeIcon icon={faPlus} /> Add File
        </button>
      </div>

      <div className="backup-targets-body">
        <ul className="files-list">
          {files.map((file) => (
            <li key={file.id} className="files-list-item">
              <div className="file-info">
                <h3 className="file-name">{file.name}</h3>
                <p className="file-path">{file.filePath}</p>
              </div>
              <div className="file-actions">
                {file.backupStatus ? (
                  <button
                    className="stop-btn"
                    onClick={() => handleStop(file.id)}
                  >
                    <FontAwesomeIcon icon={faStop} />
                  </button>
                ) : (
                  <button
                    className="start-btn"
                    onClick={() => handleBackup(file.id, file.backupPath)}
                  >
                    <FontAwesomeIcon icon={faPlay} />
                  </button>
                )}
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveFile(file.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Modal isOpen={isModalOpen} onClose={toggleModal} title="Add File">
        <AddFileForm onFileSubmit={handleFileSubmit} />
      </Modal>
    </div>
  );
};

export default BackupTargets;
