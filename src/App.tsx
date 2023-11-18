import React from "react";
import { MainArea } from "./components/organisms/MainArea";
import "./scss/App.scss";

export const App: React.FC = () => {
  return (
    <div className="app">
      <MainArea />
    </div>
  );
};
