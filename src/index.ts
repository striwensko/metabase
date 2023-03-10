/* eslint-disable camelcase */
import { generateSql } from "./transpiler/transpiler";

console.log(
  generateSql(
    "postgres",
    { 1: "id", 2: "name" },
    { where: ["=", ["field", 2], "cam"] }
  )
);
