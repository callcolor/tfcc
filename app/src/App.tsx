import React from 'react';
import { Route, Switch } from 'wouter';
import WelcomePage from './pages/WelcomePage';
import CalculatorPage from './pages/CalculatorPage';

import './App.css';

function App(): JSX.Element {
  return (
    <div className="App">
      <Switch>
        <Route path={'/welcome'} component={WelcomePage} />
        <Route path={'/'} component={CalculatorPage} />
      </Switch>
    </div>
  );
}

export default App;
