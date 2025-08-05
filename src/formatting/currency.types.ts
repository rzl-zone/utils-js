type NegativeFormatOption =
  | "dash"
  | "brackets"
  | "abs"
  | {
      /**
       * Custom formatter function for the final formatted negative string.
       * If provided, it OVERRIDES style & space entirely.
       */
      custom: (formatted: string) => string;
      style?: never;
      space?: never;
    }
  | {
      custom?: never;
      /**
       * Use style & optional spacing for negative numbers.
       * @default "dash"
       */
      style?: "dash" | "brackets" | "abs";
      /** @default false */
      space?: boolean;
    };

export type FormatCurrencyOptions = {
  /** `Default: "."` */
  suffixCurrency?: string;
  /** `Default: "."` */
  separator?: string;
  /** `Default: false` */
  decimal?: boolean;
  /** `Default: 2` */
  totalDecimal?: number;
  /** `Default: true` */
  endDecimal?: boolean;
  /** `Default: ""` */
  suffixDecimal?: string;
  /** `Default: "round"` */
  roundedDecimal?: "round" | "ceil" | "floor" | false;
  /** `Default: ","` */
  separatorDecimals?: string;
  /** @default "dash" */
  negativeFormat?: NegativeFormatOption;
  /** @default false */
  indianFormat?: boolean;
};
