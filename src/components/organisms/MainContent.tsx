import React from "react";
import { HomePage } from "../pages/HomePage";
import { HistoryPage } from "../pages/HistoryPage";
import BackupTargets from "../pages/BackupTargets";
import BackupHistory from "../pages/BackupHistory";
import { ContentTemplates, MainContentProps } from "../../interfaces";

export const MainContent: React.FC<MainContentProps> = ({ selectedCategory }) => {
  const contentTemplates: ContentTemplates = {
    "home": () => <HomePage />,
    "history": () => <HistoryPage />,
  };

  return (
    <div className="main-content">
      {contentTemplates[selectedCategory]()}
    </div>
  );
};
