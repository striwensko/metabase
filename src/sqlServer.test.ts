/* eslint-disable comma-dangle */
import { Query } from "types";
import { generateSql } from "./transpiler/transpiler";

const fields = { 1: "id", 2: "name", 3: "date_joined", 4: "age" };

const sqlServerTests: { query: Query; result: string }[] = [
  {
    query: {},
    result: "SELECT * FROM data;",
  },
  {
    query: { limit: 20 },
    result: "SELECT TOP 20 * FROM data;",
  },
  {
    query: { where: ["=", ["field", 2], "cam"] },
    result: "SELECT * FROM data WHERE name = 'cam';",
  },
  {
    query: { where: ["=", ["field", 2], "cam"], limit: 10 },
    result: "SELECT TOP 10 * FROM data WHERE name = 'cam';",
  },
];

describe("sqlserver", () => {
  test.each(sqlServerTests)("should return `$result`", ({ query, result }) => {
    expect(generateSql("sqlserver", fields, query)).toBe(result);
  });
});
