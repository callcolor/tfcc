import React, { useContext, useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { AppContext } from '../App';
import { TickerRow, Denomination, Denominated } from '../types';
import { ReactComponent as CogIcon } from '../icons/cog-outline.svg';

const useStyles = createUseStyles({
  buttonRow: {
    height: '14vh',
    width: '99vw',
  },
  buttons: {},
  calculator: {
    '& button': {
      border: 0,
      borderRadius: '5px',
      fontSize: '4vh',
      height: '12vh',
      margin: '1vh 1vw',
      verticalAlign: 'top',
      width: '17.6vw',
    },
    '& button.disabled': {
      filter: 'brightness(.70)',
      pointerEvents: 'none',
    },
    backgroundColor: ({ colors }) => colors.calculator,
    fontSize: '3vh',
    margin: 'auto',
    padding: '1vh 1vw',
  },
  iconButton: {
    '& .icon': {
      height: '40%',
      width: '80%',
    },
    fontSize: '0px !important',
  },
  longButton: {
    width: '37.2vw !important',
  },
  tallButton: {
    height: '26vh !important',
    position: 'relative',
  },
  ticker: {
    backgroundColor: ({ colors }) => colors.ticker,
    borderRadius: '5px',
    color: ({ colors }) => colors.tickerText,
    height: '26vh',
    margin: '1vh 1vw',
    overflow: 'hidden',
    position: 'relative',
  },
  tickerRows: {
    '& div': {
      whiteSpace: 'pre-wrap',
    },
    bottom: '1vh',
    maxHeight: '90%',
    overflowY: 'auto',
    position: 'absolute',
    right: '1vw',
    textAlign: 'right',
    width: '90%',
  },
});

function Calculator({
  JustInjectMyHandlersUp = {},
}: {
  JustInjectMyHandlersUp?: any;
}): JSX.Element {
  const tickerRef = useRef<HTMLDivElement | null>(null);
  const [currentValue, setCurrentValue] = useState(0);
  const [currentRow, setCurrentRow] = useState<TickerRow>({});
  const [tickerRows, setTickerRows] = useState<TickerRow[]>([]);
  const { setCurrentPage, storage } = useContext(AppContext);
  const classes = useStyles({ ...storage });

  const currency = storage.currency;
  const denominations: Denomination[] = currency.denominations.sort(
    (a: Denomination, b: Denomination) => b.value - a.value
  );

  const valueRow = (tickerRow: TickerRow): number => {
    const { denominated, numbered } = tickerRow;
    let value = 0;
    if (denominated) {
      denominations.forEach((den) => {
        value += denominated[den.unit] ? denominated[den.unit] * den.value : 0;
      });
    } else if (numbered) {
      value = numbered;
    }
    return value;
  };

  const denominate = (value: number): Denominated => {
    const denominated: Denominated = {};

    value = Math.abs(value);
    denominations.forEach((den) => {
      if (!den.enabled) return;
      const denCount = Math.floor(value / den.value);
      denominated[den.unit] = denCount;
      value -= denCount * den.value;
    });
    return denominated;
  };

  const displayRow = (tickerRow: TickerRow): string => {
    const { denominated, numbered, operation } = tickerRow;
    let parts: (string | null)[] = [];
    if (denominated) {
      parts = denominations
        .map((den) => {
          const val = denominated[den.unit];
          if (val !== undefined) {
            return `${val} ${den.unit}`;
          } else {
            return null;
          }
        })
        .filter((part) => part !== null);
    }
    if (numbered) {
      parts.push(`${numbered}`);
    }
    return `${operation || ''} ${tickerRow.isNegative ? '-' : ''}${parts.join(
      ', '
    )}`;
  };

  const handleCurrency = (denomination: Denomination) => {
    if (!currentRow.numbered) return;
    if (currentRow.operation === '=') return;
    const denominated: Denominated = currentRow.denominated || {};
    denominated[denomination.unit] = currentRow.numbered;
    setCurrentRow({
      ...currentRow,
      denominated,
      numbered: undefined,
    });
  };

  const handleDigit = (digit: number) => {
    if (currentRow.operation === '=') {
      setCurrentValue(0);
      setTickerRows([...tickerRows, currentRow]);
      setCurrentRow({
        numbered: Number(`${currentRow.numbered || ''}${digit}`),
      });
    } else {
      setCurrentRow({
        ...currentRow,
        numbered: Number(`${currentRow.numbered || ''}${digit}`),
      });
    }
  };

  const doOperation = (
    value1: number,
    value2: number,
    operation: string | undefined
  ): number => {
    switch (operation) {
      case '-': {
        return value1 - value2;
      }
      case '/': {
        return value1 / value2;
      }
      case '*': {
        return value1 * value2;
      }
      case '=': {
        return value1;
      }
      default: {
        return value1 + value2;
      }
    }
  };

  const handleOperation = (operation: string) => {
    // cannot evaluate a row with both denominated and numbered values
    // user must select a denomination for the 'numbered' value first
    if (currentRow.denominated && currentRow.numbered) return;

    // evaluate the new value; include currentValue and currentRow value
    const newValue = doOperation(
      currentValue,
      valueRow(currentRow),
      currentRow.operation
    );

    // if current row has value
    if (valueRow(currentRow) > 0) {
      // set current value to include current row value
      setCurrentValue(newValue);
      // advance the ticker
      setTickerRows([...tickerRows, currentRow]);
    } else {
      // do not evaluate the current row.
      // do not advance the ticker.
    }

    // if operation is '=', display denominated value in simplest form
    const denominated = operation === '=' ? denominate(newValue) : undefined;

    // set operation to current row
    setCurrentRow({
      denominated,
      isNegative: newValue < 0,
      operation,
    });
  };

  const handleClear = () => {
    setCurrentRow({});
    setTickerRows([]);
    setCurrentValue(0);
  };

  JustInjectMyHandlersUp.handleCurrency = handleCurrency;
  JustInjectMyHandlersUp.handleDigit = handleDigit;
  JustInjectMyHandlersUp.handleOperation = handleOperation;
  JustInjectMyHandlersUp.handleClear = handleClear;

  useEffect(() => {
    if (tickerRef.current) {
      tickerRef.current.scrollTop = tickerRef.current.scrollHeight;
    }
  }, [tickerRows]);

  return (
    <div className={classes.calculator}>
      <div className={classes.ticker} id="ticker">
        <div ref={tickerRef} className={classes.tickerRows}>
          {tickerRows.map((tickerRow, index) => (
            <div key={displayRow(tickerRow) + index}>
              {displayRow(tickerRow)}
            </div>
          ))}
          <div id="display-row">{displayRow(currentRow)}</div>
        </div>
      </div>
      <div className={classes.buttons} id="buttons">
        <div className={classes.buttonRow}>
          <button onClick={() => handleClear()}>C</button>
          <button onClick={() => handleOperation('/')} id="division">
            /
          </button>
          <button onClick={() => handleOperation('*')}>*</button>
          <button onClick={() => handleOperation('-')}>-</button>
          <button
            className={denominations[0].enabled ? 'enabled' : 'disabled'}
            onClick={() => handleCurrency(denominations[0])}
          >
            {denominations[0].unit.toUpperCase()}
          </button>
        </div>
        <div className={classes.buttonRow}>
          <button onClick={() => handleDigit(7)}>7</button>
          <button onClick={() => handleDigit(8)}>8</button>
          <button onClick={() => handleDigit(9)} id="nine">
            9
          </button>
          <button
            onClick={() => handleOperation('+')}
            className={classes.tallButton}
          >
            +
          </button>
          <button
            className={denominations[1].enabled ? 'enabled' : 'disabled'}
            onClick={() => handleCurrency(denominations[1])}
            id="gp"
          >
            {denominations[1].unit.toUpperCase()}
          </button>
        </div>
        <div className={classes.buttonRow}>
          <button onClick={() => handleDigit(4)} id="four">
            4
          </button>
          <button onClick={() => handleDigit(5)}>5</button>
          <button onClick={() => handleDigit(6)}>6</button>
          <button></button>
          <button
            className={denominations[2].enabled ? 'enabled' : 'disabled'}
            onClick={() => handleCurrency(denominations[2])}
          >
            {denominations[2].unit.toUpperCase()}
          </button>
        </div>
        <div className={classes.buttonRow}>
          <button onClick={() => handleDigit(1)}>1</button>
          <button onClick={() => handleDigit(2)}>2</button>
          <button onClick={() => handleDigit(3)}>3</button>
          <button
            onClick={() => handleOperation('=')}
            className={classes.tallButton}
            id="equals"
          >
            =
          </button>
          <button
            className={denominations[3].enabled ? 'enabled' : 'disabled'}
            onClick={() => handleCurrency(denominations[3])}
            id="sp"
          >
            {denominations[3].unit.toUpperCase()}
          </button>
        </div>
        <div className={classes.buttonRow}>
          <button className={classes.longButton} onClick={() => handleDigit(0)}>
            0
          </button>
          <button
            className={classes.iconButton}
            onClick={() => {
              setCurrentPage('settings/currency');
            }}
          >
            <CogIcon className="icon" />
          </button>
          <button></button>
          <button
            className={denominations[4].enabled ? 'enabled' : 'disabled'}
            onClick={() => handleCurrency(denominations[4])}
          >
            {denominations[4].unit.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
