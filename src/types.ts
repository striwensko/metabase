export type Field = ["field", number];
export type Fields = Record<number, string>;
export type Arg = Field | number | string | null;
export type Equal = ["=", Arg, ...Arg[]];
export type NotEqual = ["!=", Arg, ...Arg[]];
export type GreaterThan = [">", Field | number, Field | number];
export type LessThan = ["<", Field | number, Field | number];
export type IsEmpty = ["is-empty", Arg];
export type NotEmpty = ["not-empty", Arg];

export type RegularOperators =
  | Equal
  | NotEqual
  | GreaterThan
  | LessThan
  | IsEmpty
  | NotEmpty;

export type AndClause = ["and", WhereClause, ...WhereClause[]];
export type OrClause = ["or", WhereClause, ...WhereClause[]];
export type NotClause = ["not", WhereClause];
export type Macro = ["macro", string];

export type WhereClause =
  | AndClause
  | OrClause
  | NotClause
  | RegularOperators
  | Macro;

export type Transpiler = {
  "=": (
    data: Equal,
    fields: Fields,
    transpiler: Transpiler,
    macros: MacroRecord,
    isInsideAClause: boolean
  ) => string;
  "!=": (
    data: NotEqual,
    fields: Fields,
    transpiler: Transpiler,
    macros: MacroRecord,
    isInsideAClause: boolean
  ) => string;
  field: (data: Field, fields: Fields) => string;
  ">": (
    data: GreaterThan,
    fields: Fields,
    transpiler: Transpiler,
    macros: MacroRecord,
    isInsideAClause: boolean
  ) => string;
  "<": (
    data: LessThan,
    fields: Fields,
    transpiler: Transpiler,
    macros: MacroRecord,
    isInsideAClause: boolean
  ) => string;
  "is-empty": (
    data: IsEmpty,
    fields: Fields,
    transpiler: Transpiler,
    macros: MacroRecord,
    isInsideAClause: boolean
  ) => string;
  "not-empty": (
    data: NotEmpty,
    fields: Fields,
    transpiler: Transpiler,
    macros: MacroRecord,
    isInsideAClause: boolean
  ) => string;
  and: (
    data: AndClause,
    fields: Fields,
    transpiler: Transpiler,
    macros: MacroRecord,
    isInsideAClause: boolean
  ) => string;
  not: (
    data: NotClause,
    fields: Fields,
    transpiler: Transpiler,
    macros: MacroRecord,
    isInsideAClause: boolean
  ) => string;
  or: (
    data: OrClause,
    fields: Fields,
    transpiler: Transpiler,
    macros: MacroRecord,
    isInsideAClause: boolean
  ) => string;
};

export type MacroRecord = Record<string, WhereClause | Field>;

export type Query = {
  limit?: number;
  where?: WhereClause;
};
