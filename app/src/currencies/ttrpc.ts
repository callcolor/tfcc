import { Currency } from '../types';

const ttrpc: Currency = {
  denominations: [
    {
      name: 'Copper',
      unit: 'cp',
      value: 1,
    },
    {
      name: 'Silver',
      unit: 'sp',
      value: 10,
    },
    {
      name: 'Electrum',
      unit: 'ep',
      value: 50,
    },
    {
      name: 'Gold',
      unit: 'gp',
      value: 100,
    },
    {
      name: 'Platinum',
      unit: 'pp',
      value: 1000,
    },
  ],
  name: 'ttrpc',
};

export default ttrpc;
