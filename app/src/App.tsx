import React, { createContext, useEffect, useState } from 'react';
import CalculatorPage from './pages/CalculatorPage';
import WelcomePage from './pages/WelcomePage';
import SettingsPage from './pages/SettingsPage';
import ttrpc from './currencies/ttrpc';

import './App.css';

interface AppContextType {
  storage: {
    [id: string]: any;
  };
  setStorage: React.Dispatch<
    React.SetStateAction<{
      [id: string]: any;
    }>
  >;
  currentPage: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const defaultContext: AppContextType = {
  currentPage: 'calculator',
  setCurrentPage: () => null,
  setStorage: () => null,
  storage: { currency: ttrpc },
};

export const AppContext = createContext<AppContextType>(defaultContext);

function App(): JSX.Element {
  const [currentPage, setCurrentPage] = useState(defaultContext.currentPage);
  const [storage, updateStorage] = useState(
    JSON.parse(
      window.localStorage.getItem('storage.v1') ||
        JSON.stringify(defaultContext.storage)
    )
  );
  const setStorage = (update: { [id: string]: any }) => {
    updateStorage({ ...storage, ...update });
  };

  useEffect(() => {
    localStorage.setItem('storage.v1', JSON.stringify(storage));
  }, [storage]);

  return (
    <AppContext.Provider
      value={{ currentPage, setCurrentPage, setStorage, storage }}
    >
      <div className="App">
        {!storage.introComplete ? (
          <WelcomePage />
        ) : currentPage.startsWith('settings') ? (
          <SettingsPage />
        ) : currentPage.startsWith('calculator') ? (
          <CalculatorPage />
        ) : null}
      </div>
    </AppContext.Provider>
  );
}

export default App;
