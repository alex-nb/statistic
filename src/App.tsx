import React from "react";
import ErrorBoundary from "./views/ErrorBoundary/ErrorBoundary";
import MainPage from "./views/MainPage/MainPage";

function App() {
  return (
    <ErrorBoundary>
      <MainPage />
    </ErrorBoundary>
  );
}

export default App;
