import { Field, Fields, Transpiler } from "types";
import {
  andTranspiler,
  equalTranspiler,
  greatherThanTranspiler,
  isEmptyTranspiler,
  isNotEmptyTranspiler,
  lessThanTranspiler,
  notEqualTranspiler,
  notTranspiler,
  orTranspiler,
} from "./generic";

export const fieldTranspiler = (data: Field, fields: Fields) => {
  const fieldId = data[1];
  if (!fields[fieldId]) {
    throw new Error(`${fieldId} is not a valid fieldId`);
  }
  if (fields[fieldId].match(/^[a-zA-Z0-9_]*$/)) {
    return fields[fieldId];
  }
  return `\`${fields[fieldId]}\``;
};

export const mysqlTranspiler: Transpiler = {
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
