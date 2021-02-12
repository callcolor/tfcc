import React, { useContext, useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import Calculator from '../components/Calculator';
import Layout from '../layouts/Layout';
import Driver from 'driver.js';

import 'driver.js/dist/driver.min.css';
import { AppContext } from '../App';

const useStyles = createUseStyles({
  disabled: {
    pointerEvents: 'none',
  },
});

function WelcomePage(): JSX.Element {
  const classes = useStyles();
  const { setCurrentPage } = useContext(AppContext);
  const JustInjectMyHandlersUp = {
    handleClear: () => null,
    handleCurrency: (d: any) => d,
    handleDigit: (d: any) => d,
    handleOperation: (d: any) => d,
  };

  useEffect(() => {
    const driver = new Driver({
      allowClose: false,
      onReset: () => {
        setCurrentPage('calculator');
      },
    });

    driver.defineSteps([
      {
        element: '#buttons',
        onNext: () => {
          JustInjectMyHandlersUp.handleClear();
        },
        popover: {
          description:
            "I'm a calculator but I have a few extra buttons to handle the currency denominations of popular table top role playing games.",
          nextBtnText: 'next',
          position: 'top-center',
          title: 'Welcome!',
        },
      },
      {
        element: '#nine',
        onNext: () => {
          JustInjectMyHandlersUp.handleDigit(9);
        },
        popover: {
          description:
            "Let's imagine your party has just killed a dragon.  We're tasked with dividing the loot evenly among the four members of your party.  The dragon dropped 9 gold and 4 silver.  We'll start by entering the number nine (9).",
          nextBtnText: 'next',
          position: 'top-center',
          title: 'Dragon FTW!',
        },
      },
      {
        element: '#gp',
        onNext: () => {
          JustInjectMyHandlersUp.handleCurrency({ unit: 'gp' });
        },
        popover: {
          description:
            "Next we'll press the gold (GP) button.  Gold is worth 10 silver (SP) or 100 copper (CP).",
          position: 'left',
          title: 'Denomination Buttons',
        },
      },
      {
        element: '#ticker',
        popover: {
          description:
            "The ticker shows we've entered 9 gold.  Let's continue by entering an additional 4 silver.",
          position: 'bottom-right',
          title: 'Ticker',
        },
      },
      {
        element: '#four',
        onNext: () => {
          JustInjectMyHandlersUp.handleDigit(4);
        },
        popover: {
          description: "First we'll click the number 4.",
          position: 'right',
          title: 'Numeric Input',
        },
      },
      {
        element: '#sp',
        onNext: () => {
          JustInjectMyHandlersUp.handleCurrency({ unit: 'sp' });
        },
        popover: {
          description: "Then we'll click SP to specify these 4 as silver.",
          position: 'left',
          title: 'Silver',
        },
      },
      {
        element: '#ticker',
        popover: {
          description:
            "Great!  We've got the amount entered into the calculator.  Next we'll split it evenly among all four party members.",
          position: 'bottom-right',
          title: 'Ticker',
        },
      },
      {
        element: '#division',
        onNext: () => {
          JustInjectMyHandlersUp.handleOperation('/');
        },
        popover: {
          description: "First we'll click the division (/) operation.",
          position: 'bottom',
          title: 'Operation',
        },
      },
      {
        element: '#four',
        onNext: () => {
          JustInjectMyHandlersUp.handleDigit(4);
        },
        popover: {
          description: "Next we'll divide by the four (4) party members.",
          position: 'right',
          title: 'Numeric Input',
        },
      },
      {
        element: '#equals',
        onNext: () => {
          JustInjectMyHandlersUp.handleOperation('=');
        },
        popover: {
          description:
            "Finally we'll press the equals (=) button to get our result!",
          position: 'top-right',
          title: 'Numeric Input',
        },
      },
      {
        element: '#ticker',
        popover: {
          description:
            'Huzzah!  Each member of our party will receive two (2) gold, three (3) silver, and five (5) copper.',
          position: 'bottom-right',
          title: 'Ticker',
        },
      },
      {
        element: '#buttons',
        popover: {
          description:
            "Now it's your turn.  Close this tutorial to start using your new calculator.",
          nextBtnText: 'next',
          position: 'top-center',
          title: 'FIN',
        },
      },
    ]);
    driver.start(0);
  }, []);

  return (
    <Layout>
      <div className={classes.disabled}>
        <Calculator JustInjectMyHandlersUp={JustInjectMyHandlersUp} />
      </div>
    </Layout>
  );
}

export default WelcomePage;
