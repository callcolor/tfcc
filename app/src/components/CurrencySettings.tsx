import React, { useContext, useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import Driver from 'driver.js';
import { AppContext } from '../App';
import { Currency, Denomination } from '../types';
import { cloneDeep } from 'lodash';
import { ReactComponent as BackIcon } from '../icons/arrow-left.svg';
import { ReactComponent as CloseIcon } from '../icons/close.svg';
import { ReactComponent as OnnIcon } from '../icons/toggle-switch-outline.svg';
import { ReactComponent as OffIcon } from '../icons/toggle-switch-off-outline.svg';

import 'driver.js/dist/driver.min.css';

const useStyles = createUseStyles({
  backIcon: {
    float: 'left',
  },
  closeIcon: {
    float: 'right',
  },
  disabled: {
    backgroundColor: '#c6c5c5 !important',
    color: '#716b6b',
  },
  header: {
    '& .icon': {
      height: '70%',
    },
    fontSize: '3.5vh',
    height: '6vh',
    lineHeight: '1em',
    margin: 'auto',
    textAlign: 'center',
    width: '80vw',
  },
  input: {
    backgroundColor: '#f9f9f9',
    border: 'none',
    fontSize: '3vh',
    height: '3vh',
    padding: '3vh 3vw',
    textAlign: 'right',
    verticalAlign: 'top',
    width: '50vw',
  },
  inputRow: {
    margin: '3vh auto',
    width: '80vw',
  },
  label: {
    border: '1px solid #e8f4e6',
    borderRadius: '0px 15px 15px 0px',
    fontSize: '3vh',
    height: 'calc(3vh - 2px)',
    padding: '2.25vh 3vw 3.75vh 3vw',
    textAlign: 'center',
    width: 'calc(6vw - 2px)',
  },
  labelSwitch: {
    display: 'inline-block',
    verticalAlign: 'top',
  },
  off: {
    '& .icon': {
      fill: 'red',
    },
    border: '1px solid #d9b0b0',
  },
  onn: {
    '& .icon': {
      fill: 'green',
    },
    border: '1px solid #b0d9b0',
  },
  save: {
    backgroundColor: '#b0d9b0',
    borderRadius: '15px',
    fontSize: '3vh',
    margin: '6vh auto',
    padding: '3vh 3vw',
    textAlign: 'center',
    width: '75vw',
  },
  settings: {},
  switch: {
    '& .icon': {
      display: 'block',
      height: '65%',
      margin: 'auto',
      maxWidth: '80%',
      padding: '1.5vh 1.5vw',
      textAlign: 'center',
      width: '100%',
    },
    borderRadius: '15px 0px 0px 15px',
    height: 'calc(9vh - 2px)',
    width: 'calc(12vw - 2px)',
  },
  wrapper: {
    background: 'white',
    borderRadius: '5px',
    height: '100vh',
    padding: '4vh 0',
    width: '100vw',
  },
});

const Header = (): JSX.Element => {
  const classes = useStyles();
  const { setCurrentPage, storage, setStorage } = useContext(AppContext);
  const [formCurrency, setFormCurrency] = useState<Currency>(
    cloneDeep(storage.currency)
  );

  const denominations: Denomination[] = formCurrency.denominations.sort(
    (a: Denomination, b: Denomination) =>
      a.unit === 'cp' ? Number.MAX_SAFE_INTEGER : b.value - a.value
  );

  useEffect(() => {
    const driver = new Driver({
      allowClose: false,
    });

    driver.defineSteps([
      // {
      //   element: '#buttons',
      //   popover: {
      //     description:
      //       "I'm a calculator but I have a few extra buttons to handle the currency denominations of popular table top role playing games.",
      //     nextBtnText: 'next',
      //     position: 'top-center',
      //     title: 'Welcome!',
      //   },
      // },
    ]);

    // driver.start(0);
  }, []);

  return (
    <div className={classes.wrapper}>
      <div className={classes.header}>
        <BackIcon
          className={`icon ${classes.backIcon}`}
          onClick={() => {
            setCurrentPage('calculator');
          }}
        />
        Currency Settings
        <CloseIcon
          className={`icon ${classes.closeIcon}`}
          onClick={() => {
            setCurrentPage('calculator');
          }}
        />
      </div>
      <div className={classes.settings}>
        {denominations.map((den, index) => (
          <div key={den.unit} className={classes.inputRow}>
            <div
              className={`${classes.switch} ${classes.labelSwitch} ${
                den.enabled ? classes.onn : classes.off
              }`}
              onClick={() => {
                if (index === 4) return;
                den.enabled = !den.enabled;
                setFormCurrency({ ...formCurrency });
              }}
            >
              {den.enabled ? (
                <OnnIcon className="icon" />
              ) : (
                <OffIcon className="icon" />
              )}
            </div>
            <input
              disabled={index === 4 || !den.enabled}
              className={`${classes.input} ${
                index === 4 || !den.enabled ? classes.disabled : ''
              }`}
              value={Math.floor(den.value)}
              onChange={(e) => {
                den.value = Math.floor(Number(e.target.value)) || 0;
                setFormCurrency({ ...formCurrency });
              }}
            />
            <div className={`${classes.label} ${classes.labelSwitch}`}>
              {den.unit.toUpperCase()}
            </div>
          </div>
        ))}
        <div
          onClick={() => {
            setStorage({ currency: formCurrency });
            setCurrentPage('calculator');
          }}
          className={classes.save}
        >
          Save
        </div>
      </div>
    </div>
  );
};

export default Header;
