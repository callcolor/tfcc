import React, { createContext, useEffect, useState } from 'react';
import CalculatorPage from './pages/CalculatorPage';
import WelcomePage from './pages/WelcomePage';
import './App.css';

interface AppContextType {
  currentPage: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

function App(): JSX.Element {
  const [currentPage, setCurrentPage] = useState(
    window.localStorage.getItem('currentPage') || 'welcome'
  );

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  return (
    <AppContext.Provider value={{ currentPage, setCurrentPage }}>
      <div className="App">
        {currentPage === 'welcome' ? <WelcomePage /> : <CalculatorPage />}
      </div>
    </AppContext.Provider>
  );
}

export default App;
