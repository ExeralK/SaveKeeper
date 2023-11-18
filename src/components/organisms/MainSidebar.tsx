import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { Sidebar, SidebarTitle, SidebarList, SidebarItem } from "../atoms";

export const MainSidebar: React.FC<{
  setSelectedCategory: (category: string) => void;
  selectedCategory: string;
}> = ({ setSelectedCategory, selectedCategory }) => {
   const categories = [
     { value: "home", label: "Home", icon: faHouse },
     { value: "history", label: "History", icon: faClockRotateLeft },
   ];

  return (
    <Sidebar>
      <SidebarTitle>GuardianEX</SidebarTitle>
      <SidebarList>
        {categories.map((category) => (
          <SidebarItem
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={selectedCategory === category.value ? "is-active" : ""}
          >
            <FontAwesomeIcon icon={category.icon} />
            <span>{category.label}</span>
          </SidebarItem>
        ))}
      </SidebarList>
    </Sidebar>
  );
};
