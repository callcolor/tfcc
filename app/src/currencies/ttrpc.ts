import { Currency } from '../types';

const ttrpc: Currency = {
  denominations: [
    {
      enabled: true,
      name: 'Copper',
      unit: 'cp',
      value: 1,
    },
    {
      enabled: true,
      name: 'Silver',
      unit: 'sp',
      value: 10,
    },
    {
      enabled: true,
      name: 'Electrum',
      unit: 'ep',
      value: 50,
    },
    {
      enabled: true,
      name: 'Gold',
      unit: 'gp',
      value: 100,
    },
    {
      enabled: true,
      name: 'Platinum',
      unit: 'pp',
      value: 1000,
    },
  ],
  name: 'ttrpc',
};

export default ttrpc;
