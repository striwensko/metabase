import { Transpiler } from "types";
import {
  andTranspiler,
  equalTranspiler,
  fieldTranspiler,
  greatherThanTranspiler,
  isEmptyTranspiler,
  isNotEmptyTranspiler,
  lessThanTranspiler,
  notEqualTranspiler,
  notTranspiler,
  orTranspiler,
} from "./generic";

export const sqlserverTranspiler: Transpiler = {
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
