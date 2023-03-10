/* eslint-disable camelcase */
/* eslint-disable comma-dangle */
import { Query } from "types";
import { generateSql } from "./transpiler/transpiler";

const fields = { 1: "id", 2: "name", 3: "date-joined", 4: "age" };

const postgresTests: { query: Query; result: string }[] = [
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
  {
    query: {
      where: ["and", ["=", ["field", 2], "cam"]],
      limit: 10,
    },
    result: "SELECT * FROM data WHERE name = 'cam' LIMIT 10;",
  },
  // More Specific Tests
  {
    query: { where: ["=", ["field", 3], null] },
    // eslint-disable-next-line quotes
    result: 'SELECT * FROM data WHERE "date-joined" IS NULL;',
  },
  {
    query: {
      where: ["and", ["<", ["field", 1], 5], ["=", ["field", 2], "joe"]],
    },
    result: "SELECT * FROM data WHERE id < 5 AND name = 'joe';",
  },
  {
    query: {
      where: [
        "or",
        ["!=", ["field", 3], "2015-11-01"],
        ["=", ["field", 1], 456],
      ],
    },
    result:
      "SELECT * FROM data WHERE \"date-joined\" <> '2015-11-01' OR id = 456;",
  },
  {
    query: {
      where: [
        "and",
        ["!=", ["field", 3], null],
        ["or", [">", ["field", 4], 25], ["=", ["field", 2], "Jerry"]],
      ],
    },
    result:
      "SELECT * FROM data WHERE \"date-joined\" IS NOT NULL AND (age > 25 OR name = 'Jerry');",
  },
  {
    query: { where: ["=", ["field", 4], 25, 26, 27] },
    result: "SELECT * FROM data WHERE age IN (25, 26, 27);",
  },
  {
    query: { where: ["=", ["field", 2], "cam"] },
    result: "SELECT * FROM data WHERE name = 'cam';",
  },
  {
    query: { where: [">", ["field", 4], 35] },
    result: "SELECT * FROM data WHERE age > 35;",
  },
];

describe("postgress", () => {
  test.each(postgresTests)("should return `$result`", ({ query, result }) => {
    expect(generateSql("postgres", fields, query)).toBe(result);
  });
  test("throws error on bad field id ", () => {
    expect(() => {
      generateSql("postgres", fields, { where: [">", ["field", -1], 35] });
    }).toThrow(/-1 is not a valid fieldId/);
  });
  test("Macros test ", () => {
    expect(
      generateSql(
        "postgres",
        fields,
        {
          where: ["and", ["<", ["field", 1], 5], ["macro", "is_old_joe"]],
        },
        {
          is_joe: ["=", ["field", 2], "joe"],
          is_adult: [">", ["field", 4], 18],
          is_old_joe: [
            "and",
            ["=", ["field", 2], "joe"],
            [">", ["field", 4], 18],
          ],
        }
      )
    ).toBe("SELECT * FROM data WHERE id < 5 AND (name = 'joe' AND age > 18);");
  });
});
