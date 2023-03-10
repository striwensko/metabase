import {
  Field,
  Equal,
  Fields,
  Transpiler,
  NotEqual,
  GreaterThan,
  IsEmpty,
  NotEmpty,
  AndClause,
  OrClause,
  NotClause,
  LessThan,
  MacroRecord,
} from "types";
import { transpile } from "../transpiler";

export const fieldTranspiler = (data: Field, fields: Fields) => {
  const fieldId = data[1];
  if (!fields[fieldId]) {
    throw new Error(`${fieldId} is not a valid fieldId`);
  }
  if (fields[fieldId].match(/^[a-zA-Z0-9_]*$/)) {
    return fields[fieldId];
  }
  return `"${fields[fieldId]}"`;
};

export const equalTranspiler = (
  data: Equal,
  fields: Fields,
  transpiler: Transpiler,
  macros: MacroRecord,
  isInsideAClause: boolean
) => {
  if (data.length === 3) {
    if (data[2] === null) {
      return `${transpile(
        data[1],
        fields,
        transpiler,
        macros,
        isInsideAClause
      )} IS NULL`;
    }
    return `${transpile(
      data[1],
      fields,
      transpiler,
      macros,
      isInsideAClause
    )} = ${transpile(data[2], fields, transpiler, macros, isInsideAClause)}`;
  }
  return `${transpile(
    data[1],
    fields,
    transpiler,
    macros,
    isInsideAClause
  )} IN (${data
    .slice(2)
    .map((arg) => transpile(arg, fields, transpiler, macros, isInsideAClause))
    .join(", ")})`;
};

export const notEqualTranspiler = (
  data: NotEqual,
  fields: Fields,
  transpiler: Transpiler,
  macros: MacroRecord,
  isInsideAClause: boolean
) => {
  if (data.length === 3) {
    if (data[2] === null) {
      return `${transpile(
        data[1],
        fields,
        transpiler,
        macros,
        isInsideAClause
      )} IS NOT NULL`;
    }
    return `${transpile(
      data[1],
      fields,
      transpiler,
      macros,
      isInsideAClause
    )} != ${transpile(data[2], fields, transpiler, macros, isInsideAClause)}`;
  }
  return `${transpile(
    data[1],
    fields,
    transpiler,
    macros,
    isInsideAClause
  )} NOT IN (${data
    .slice(2)
    .map((arg) => transpile(arg, fields, transpiler, macros, isInsideAClause))
    .join(", ")})`;
};

export const greatherThanTranspiler = (
  data: GreaterThan,
  fields: Fields,
  transpiler: Transpiler,
  macros: MacroRecord,
  isInsideAClause: boolean
) =>
  `${transpile(
    data[1],
    fields,
    transpiler,
    macros,
    isInsideAClause
  )} > ${transpile(data[2], fields, transpiler, macros, isInsideAClause)}`;
export const lessThanTranspiler = (
  data: LessThan,
  fields: Fields,
  transpiler: Transpiler,
  macros: MacroRecord,
  isInsideAClause: boolean
) =>
  `${transpile(
    data[1],
    fields,
    transpiler,
    macros,
    isInsideAClause
  )} < ${transpile(data[2], fields, transpiler, macros, isInsideAClause)}`;

export const isEmptyTranspiler = (
  data: IsEmpty,
  fields: Fields,
  transpiler: Transpiler,
  macros: MacroRecord,
  isInsideAClause: boolean
) =>
  `${transpile(data[1], fields, transpiler, macros, isInsideAClause)} IS NULL`;

export const isNotEmptyTranspiler = (
  data: NotEmpty,
  fields: Fields,
  transpiler: Transpiler,
  macros: MacroRecord,
  isInsideAClause: boolean
) =>
  `${transpile(
    data[1],
    fields,
    transpiler,
    macros,
    isInsideAClause
  )} IS NOT NULL`;

export const andTranspiler = (
  data: AndClause,
  fields: Fields,
  transpiler: Transpiler,
  macros: MacroRecord,
  isInsideAClause: boolean
) => {
  let output = "";
  if (isInsideAClause) {
    output += "(";
  }
  for (let iClause = 1; iClause < data.length; iClause++) {
    output += iClause > 1 ? " AND " : "";
    output += transpile(data[iClause], fields, transpiler, macros, true);
  }
  if (isInsideAClause) {
    output += ")";
  }
  return output;
};
export const orTranspiler = (
  data: OrClause,
  fields: Fields,
  transpiler: Transpiler,
  macros: MacroRecord,
  isInsideAClause: boolean
) => {
  let output = "";
  if (isInsideAClause) {
    output += "(";
  }
  for (let iClause = 1; iClause < data.length; iClause++) {
    output += iClause > 1 ? " OR " : "";
    output += transpile(data[iClause], fields, transpiler, macros, true);
  }
  if (isInsideAClause) {
    output += ")";
  }
  return output;
};
export const notTranspiler = (
  data: NotClause,
  fields: Fields,
  transpiler: Transpiler,
  macros: MacroRecord,
  isInsideAClause: boolean
) => {
  if (isInsideAClause) {
    return `NOT (${transpile(data[1], fields, transpiler, macros, true)})`;
  } else {
    return `NOT ${transpile(data[1], fields, transpiler, macros, true)}`;
  }
};
// "is-empty": (data: IsEmpty, fields: Fields, transpiler: Transpiler) => string;
//   "not-empty": (
//     data: NotEmpty,
//     fields: Fields,
//     transpiler: Transpiler
//   ) => string;
