import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import ttrpc from '../currencies/ttrpc';
import { TickerRow, Denomination, Denominated } from '../types';

const useStyles = createUseStyles({
  buttonRow: {
    height: '14vh',
    width: '99vw',
  },
  buttons: {},
  calculator: {
    '& button': {
      fontSize: '4vh',
      height: '12vh',
      margin: '1vh 1vw',
      verticalAlign: 'top',
      width: '17.6vw',
    },
    backgroundColor: '#484848',
    fontSize: '3vh',
    margin: 'auto',
    padding: '1vh 1vw',
  },
  longButton: {
    width: '37.2vw !important',
  },
  tallButton: {
    height: '26vh !important',
    position: 'relative',
  },
  ticker: {
    backgroundColor: 'white',
    borderRadius: '5px',
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

const currency = ttrpc;
const denominations = currency.denominations.sort((a, b) => b.value - a.value);

export const valueRow = (tickerRow: TickerRow): number => {
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

export const denominate = (value: number): Denominated => {
  const denominated: Denominated = {};
  denominations.forEach((den) => {
    const denCount = Math.floor(value / den.value);
    denominated[den.unit] = denCount;
    value -= denCount * den.value;
  });
  return denominated;
};

export const displayRow = (tickerRow: TickerRow): string => {
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
  return `${operation || ''} ${parts.join(', ')}`;
};

export const testTickerRow = {
  denominated: {
    cp: 34000,
    gp: 1,
    pp: 2,
    sp: 4,
  },
};

function Calculator(): JSX.Element {
  const classes = useStyles();
  const tickerRef = useRef<HTMLDivElement | null>(null);
  const [currentValue, setCurrentValue] = useState(0);
  const [currentRow, setCurrentRow] = useState<TickerRow>({});
  const [tickerRows, setTickerRows] = useState<TickerRow[]>([]);

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
    if (currentRow.denominated && currentRow.numbered) return;
    const newValue = doOperation(
      currentValue,
      valueRow(currentRow),
      currentRow.operation
    );
    if (valueRow(currentRow) > 0) {
      setCurrentValue(newValue);
      setTickerRows([...tickerRows, currentRow]);
    }
    setCurrentRow({
      denominated: operation === '=' ? denominate(newValue) : undefined,
      operation,
    });
  };

  const handleClear = () => {
    setCurrentRow({});
    setTickerRows([]);
    setCurrentValue(0);
  };

  useEffect(() => {
    if (tickerRef.current) {
      tickerRef.current.scrollTop = tickerRef.current.scrollHeight;
    }
  }, [tickerRows]);

  return (
    <div className={classes.calculator}>
      <div className={classes.ticker}>
        <div ref={tickerRef} className={classes.tickerRows}>
          {tickerRows.map((tickerRow, index) => (
            <div key={displayRow(tickerRow) + index}>
              {displayRow(tickerRow)}
            </div>
          ))}
          <div>{displayRow(currentRow)}</div>
        </div>
      </div>
      <div className={classes.buttons}>
        <div className={classes.buttonRow}>
          <button onClick={() => handleClear()}>C</button>
          <button onClick={() => handleOperation('/')}>/</button>
          <button onClick={() => handleOperation('*')}>*</button>
          <button onClick={() => handleOperation('-')}>-</button>
          <button onClick={() => handleCurrency(denominations[0])}>
            {denominations[0].unit.toUpperCase()}
          </button>
        </div>
        <div className={classes.buttonRow}>
          <button onClick={() => handleDigit(7)}>7</button>
          <button onClick={() => handleDigit(8)}>8</button>
          <button onClick={() => handleDigit(9)}>9</button>
          <button
            onClick={() => handleOperation('+')}
            className={classes.tallButton}
          >
            +
          </button>
          <button onClick={() => handleCurrency(denominations[1])}>
            {denominations[1].unit.toUpperCase()}
          </button>
        </div>
        <div className={classes.buttonRow}>
          <button onClick={() => handleDigit(4)}>4</button>
          <button onClick={() => handleDigit(5)}>5</button>
          <button onClick={() => handleDigit(6)}>6</button>
          <button></button>
          <button onClick={() => handleCurrency(denominations[2])}>
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
          >
            =
          </button>
          <button onClick={() => handleCurrency(denominations[3])}>
            {denominations[3].unit.toUpperCase()}
          </button>
        </div>
        <div className={classes.buttonRow}>
          <button className={classes.longButton} onClick={() => handleDigit(0)}>
            0
          </button>
          <button style={{ visibility: 'hidden' }}></button>
          <button></button>
          <button onClick={() => handleCurrency(denominations[4])}>
            {denominations[4].unit.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
