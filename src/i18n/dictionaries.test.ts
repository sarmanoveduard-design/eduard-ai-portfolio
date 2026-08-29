import { describe, expect, it } from "vitest";
import { dictionaries } from "./dictionaries";

function dictionaryShape(value: unknown): unknown {
  if (Array.isArray(value)) return [value.length > 0 ? dictionaryShape(value[0]) : null];
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, dictionaryShape(child)]),
    );
  }
  return typeof value;
}

describe("localized dictionaries", () => {
  it("keeps the RU and EN dictionaries structurally aligned", () => {
    expect(dictionaryShape(dictionaries.ru)).toEqual(dictionaryShape(dictionaries.en));
  });
});
