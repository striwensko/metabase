/* eslint-disable camelcase */
/* eslint-disable comma-dangle */
import { MacroRecord, Query } from "types";
import { generateSql } from "./transpiler/transpiler";

const fields = { 1: "id", 2: "name", 3: "date_joined", 4: "age" };

const mySqlTests: { query: Query; result: string }[] = [
  {
    query: {},
    result: "SELECT * FROM data;",
  },
  {
    query: { limit: 20 },
    result: "SELECT * FROM data LIMIT 20;",
  },
  {
    query: { where: ["=", ["field", 2], "cam"] },
    result: "SELECT * FROM data WHERE name = 'cam';",
  },
  {
    query: { where: ["=", ["field", 2], "cam"], limit: 10 },
    result: "SELECT * FROM data WHERE name = 'cam' LIMIT 10;",
  },
];

const macro: MacroRecord = {
  is_joe: ["=", ["field", 2], "joe"],
  is_adult: [">", ["field", 4], 18],

  Is_old_joe: ["and", ["macro", "is_joe"], ["macro", "is_old"]],
};

describe("mySql", () => {
  test.each(mySqlTests)("should return `$result`", ({ query, result }) => {
    expect(generateSql("mysql", fields, query)).toBe(result);
  });
});
