import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { config } from "../../config";
import "../../scss/BackupHistory.scss";

const BackupHistory: React.FC = () => {
  const [backupFiles, setBackupFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const { electron } = window as any;
  const savedFiles = localStorage.getItem("files");
  const itemsPerPage = config.itemsPerPage
  const totalPages = Math.ceil(backupFiles.length / itemsPerPage);

  useEffect(() => {
    const fetchBackupFiles = async () => {
      const backupPath = config.backupDirectory // Replace with the actual backup directory path
      const { success, backupFiles, error } = await electron.showBackups({
        backupPath,
      });

      if (success) {
        setBackupFiles(backupFiles);
      } else {
        console.error("Error fetching backup files:", error);
      }
    };

    fetchBackupFiles();
  }, []);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const getTargetPath = (targetName: string = "") => {
    const savedFiles = localStorage.getItem("files");

    if (savedFiles) {
      const parsedFiles = JSON.parse(savedFiles);

      for (const file of parsedFiles) {
        if (file.name.includes(targetName)) {
          return file.filePath;
        }
      }
    }

    return null;
  };

  const handleReplace = async (file: any) => {
    const fileName = file.name;
    const targetName = fileName.split("_")[0];
    const targetPath = getTargetPath(targetName);
    const backupPath = file.path;
  
    if (targetPath) {
      const { success, error } = await electron.replaceFile({
        targetPath: targetPath,
        backupPath: backupPath,
      });

      if (success) {
        alert("File replaced successfully");
      } else {
        alert(`Failed to replace file: ${error}`);
      }
    } else {
      console.log("Target file not found.");
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (filePath: string) => {
    const { success, error } = await electron.deleteFile({ filePath });

    if (success) {
      alert("File deleted successfully");
      // Remove the deleted file from the backupFiles state
      setBackupFiles(backupFiles.filter((file) => file.path !== filePath));
    } else {
      alert(`Failed to delete file: ${error}`);
    }
  };

  const sortedBackupFiles = backupFiles
    .sort((a, b) => new Date(b.mtime).getTime() - new Date(a.mtime).getTime())
    .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div className="backup-history">
      <h2>Backup History</h2>
      {sortedBackupFiles.length === 0 && (
        <p className="no-backups-message">You don't have any backups.</p>
      )}

      {sortedBackupFiles.length !== 0 && (
        <div>
          <ul className="backup-files-list">
            {sortedBackupFiles.map((file, index) => (
              <li key={index} className="file-item">
                <div className="file-info">
                  <div className="file-name">{file.name}</div>
                  <div className="file-modified">
                    Last modified: {new Date(file.mtime).toLocaleString()}
                  </div>
                  <div className="file-size">{formatBytes(file.size)}</div>
                </div>

                <div className="file-actions">
                  <button
                    className="replace-btn"
                    onClick={() => handleReplace(file)}
                  >
                    <FontAwesomeIcon icon={faExchangeAlt} />
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(file.path)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  className={`page-number ${
                    pageNumber === currentPage ? "active-page" : ""
                  }`}
                  onClick={() => handlePageClick(pageNumber)}
                >
                  {pageNumber + 1}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupHistory;
