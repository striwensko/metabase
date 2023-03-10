/* eslint-disable camelcase */
/* eslint-disable comma-dangle */
import { sanitizeMacros } from "./transpiler/transpiler";

describe("postgress", () => {
  test("sanitize macros", () => {
    expect(
      sanitizeMacros({
        is_joe: ["=", ["field", 2], "joe"],
        is_adult: [">", ["field", 4], 18],
        Is_old_joe: ["and", ["macro", "is_joe"], ["macro", "is_adult"]],
      })
    ).toEqual({
      is_joe: ["=", ["field", 2], "joe"],
      is_adult: [">", ["field", 4], 18],
      Is_old_joe: ["and", ["=", ["field", 2], "joe"], [">", ["field", 4], 18]],
    });
  });
  test("sanitize macros throw unregistered macro", () => {
    expect(() => {
      sanitizeMacros({
        is_good: ["and", ["macro", "is_ddecent"], [">", ["field", 4], 18]],
      });
    }).toThrow(new Error("is_ddecent macro isn't registered"));
  });
  test("sanitize macros throw circular ref macro", () => {
    expect(() => {
      sanitizeMacros({
        is_good: ["and", ["macro", "is_decent"], [">", ["field", 4], 18]],
        is_decent: ["and", ["macro", "is_good"], ["<", ["field", 5], 5]],
      });
    }).toThrow(new Error("Circular reference on macros"));
  });
});
