import React, { useState } from "react";
import { MainAreaContainer } from "../atoms";
import { MainSidebar } from "./MainSidebar";
import { MainContent } from "./MainContent";

export const MainArea: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("home");

  return (
    <MainAreaContainer>
      <MainSidebar
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
      />
      <MainContent selectedCategory={selectedCategory} />
    </MainAreaContainer>
  );
};
