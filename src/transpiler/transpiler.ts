import {
  Arg,
  WhereClause,
  Fields,
  Transpiler,
  Query,
  MacroRecord,
  Field,
} from "types";
import { mysqlTranspiler } from "./languages/mysql";
import { postgresTranspiler } from "./languages/postgress";
import { sqlserverTranspiler } from "./languages/sqlserver";

export const transpile = (
  query: WhereClause | Arg,
  fields: Fields,
  transpiler: Transpiler,
  macro: MacroRecord,
  isInsideAClause = false
): string => {
  if (query === null) {
    return "null";
  }
  if (typeof query === "string") {
    return `'${query}'`;
  }
  if (typeof query === "number") {
    return query.toString();
  }

  const operator = query[0];
  if (operator === "macro") {
    const macroName = query[1];
    if (macro[macroName] === undefined) {
      throw new Error(macroName + " macro isn't registered");
    }
    return transpile(
      macro[macroName],
      fields,
      transpiler,
      macro,
      isInsideAClause
    );
  }
  if (!transpiler[operator]) {
    return "";
  }
  return transpiler[operator](
    query as any,
    fields,
    transpiler,
    macro,
    isInsideAClause
  );
};

const solveDeps = (
  macro: WhereClause | Field,
  macros: MacroRecord,
  usedMacros: Set<string>
): WhereClause | Field => {
  for (let iArg = 1; iArg < macro.length; iArg++) {
    const arg = macro[iArg];
    if (arg && arg.constructor === Array && arg[0] === "macro") {
      const macroName = arg[1];
      if (usedMacros.has(macroName)) {
        throw new Error("Circular reference on macros");
      }
      const value = macros[macroName];
      if (value === undefined) {
        throw new Error(macroName + " macro isn't registered");
      }
      usedMacros.add(macroName);

      macro[iArg] = solveDeps(value, macros, usedMacros);
    } else if (arg && arg.constructor === Array) {
      macro[iArg] = solveDeps(arg, macros, usedMacros);
    }
  }
  return macro;
};

export const sanitizeMacros = (macros: MacroRecord) => {
  const cleanMacros: MacroRecord = {};
  for (const name in macros) {
    const macro = macros[name];
    cleanMacros[name] = solveDeps(macro, macros, new Set());
  }
  return macros;
};

const generateSQLServer = (
  fields: Fields,
  query: Query,
  macro: MacroRecord
) => {
  const limit = query.limit;
  const limitText =
    limit !== null && limit !== undefined ? ` TOP ${limit}` : "";
  const where = query.where
    ? ` WHERE ${transpile(query.where, fields, sqlserverTranspiler, macro)}`
    : "";
  return `SELECT${limitText} * FROM data${where};`;
};
const generatePostgress = (
  fields: Fields,
  query: Query,
  macro: MacroRecord
) => {
  const limit = query.limit;
  const limitText =
    limit !== null && limit !== undefined ? ` LIMIT ${limit}` : "";
  const where = query.where
    ? ` WHERE ${transpile(query.where, fields, postgresTranspiler, macro)}`
    : "";
  return `SELECT * FROM data${where}${limitText};`;
};
const generateMysql = (fields: Fields, query: Query, macro: MacroRecord) => {
  const limit = query.limit;
  const limitText =
    limit !== null && limit !== undefined ? ` LIMIT ${limit}` : "";
  const where = query.where
    ? ` WHERE ${transpile(query.where, fields, mysqlTranspiler, macro)}`
    : "";
  return `SELECT * FROM data${where}${limitText};`;
};
export const generateSql = (
  dialect: "sqlserver" | "postgres" | "mysql",
  fields: Fields,
  query: Query,
  macro?: MacroRecord
) => {
  const sanitizedMacros: MacroRecord = macro ? sanitizeMacros(macro) : {};
  if (dialect === "sqlserver") {
    return generateSQLServer(fields, query, sanitizedMacros);
  } else if (dialect === "postgres") {
    return generatePostgress(fields, query, sanitizedMacros);
  }
  return generateMysql(fields, query, sanitizedMacros);
};
