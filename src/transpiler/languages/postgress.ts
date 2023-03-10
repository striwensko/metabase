import { transpile } from "../../transpiler/transpiler";
import { Fields, MacroRecord, NotEqual, Transpiler } from "types";
import {
  andTranspiler,
  equalTranspiler,
  fieldTranspiler,
  greatherThanTranspiler,
  isEmptyTranspiler,
  isNotEmptyTranspiler,
  lessThanTranspiler,
  notTranspiler,
  orTranspiler,
} from "./generic";

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
    )} <> ${transpile(data[2], fields, transpiler, macros, isInsideAClause)}`;
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

export const postgresTranspiler: Transpiler = {
  field: fieldTranspiler,
  "=": equalTranspiler,
  "!=": notEqualTranspiler,
  "<": lessThanTranspiler,
  ">": greatherThanTranspiler,
  "is-empty": isEmptyTranspiler,
  "not-empty": isNotEmptyTranspiler,
  and: andTranspiler,
  or: orTranspiler,
  not: notTranspiler,
};
