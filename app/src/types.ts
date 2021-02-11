export interface Currency {
  denominations: Denomination[];
  name: string;
}

export interface Denominated {
  [id: string]: number;
}

export interface Denomination {
  name: string;
  unit: string;
  value: number;
}

export interface TickerRow {
  denominated?: Denominated;
  isNegative?: boolean;
  numbered?: number;
  operation?: string;
}
