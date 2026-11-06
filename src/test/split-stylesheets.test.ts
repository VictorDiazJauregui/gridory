import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import manifestSource from "../../package.json?raw";
import {
  findFirstDifference,
  joinSplitStylesheets,
  stripViteMarker,
} from "../../scripts/check-split-stylesheets.mjs";
import {
  BASE_STYLESHEET,
  SPLIT_STYLESHEETS,
  UnsupportedCssTargetError,
  toLightningcssTargets,
} from "../../scripts/split-stylesheets.mjs";

const manifest = JSON.parse(manifestSource) as { exports: Record<string, unknown> };
const componentStylesheets = Object.keys(import.meta.glob("../components/*/styles.css")).map((file) =>
  file.replace("../", "src/"),
);
const BASE_COMPONENT_IMPORT = /@import "\.\.\/(components\/[^"]+)"/g;
const importedByBase = [...readFileSync(BASE_STYLESHEET.source, "utf8").matchAll(BASE_COMPONENT_IMPORT)].map(
  ([, file]) => `src/${file}`,
);

describe("SPLIT_STYLESHEETS", () => {
  test("starts with base.css, built from the stylesheet the entries import", () => {
    expect(SPLIT_STYLESHEETS[0]).toBe(BASE_STYLESHEET);
    expect(BASE_STYLESHEET).toEqual({ fileName: "base.css", source: "src/styles/index.css" });
  });

  test("gives every component stylesheet a sheet of its own unless base.css already holds it", () => {
    const sources = SPLIT_STYLESHEETS.map(({ source }) => source);
    const leftOut = componentStylesheets.filter((file) => !sources.includes(file) && !importedByBase.includes(file));
    expect(leftOut).toEqual([]);
  });

  test("exports every sheet from the package under its own name", () => {
    for (const { fileName } of SPLIT_STYLESHEETS) {
      expect(manifest.exports[`./${fileName}`]).toBe(`./dist/${fileName}`);
    }
  });

  test("keeps styles.css pointing to the whole bundle", () => {
    expect(manifest.exports["./styles.css"]).toBe("./dist/gridory.css");
  });
});

describe("toLightningcssTargets", () => {
  test("turns Vite's default browser targets into lightningcss versions", () => {
    expect(toLightningcssTargets(["chrome111", "edge111", "firefox114", "safari16.4", "ios16.4"])).toEqual({
      chrome: 111 << 16,
      edge: 111 << 16,
      firefox: 114 << 16,
      safari: (16 << 16) | (4 << 8),
      ios_saf: (16 << 16) | (4 << 8),
    });
  });

  test("accepts a single target", () => {
    expect(toLightningcssTargets("chrome120")).toEqual({ chrome: 120 << 16 });
  });

  test("leaves the targets out when the CSS target is turned off", () => {
    expect(toLightningcssTargets(false)).toBeUndefined();
  });

  test("rejects a target that is not a browser version", () => {
    expect(() => toLightningcssTargets(["esnext"])).toThrow(UnsupportedCssTargetError);
  });
});

describe("check-split-stylesheets", () => {
  test("drops the marker Vite appends to the bundle", () => {
    expect(stripViteMarker(".a{color:red}\n/*$vite$:1*/")).toBe(".a{color:red}");
  });

  test("joins the sheets without their trailing newline", () => {
    expect(joinSplitStylesheets([".a{top:0}\n", ".b{top:0}\n"])).toBe(".a{top:0}.b{top:0}");
  });

  test("finds no difference between equal texts", () => {
    expect(findFirstDifference(".a{top:0}.b{top:0}", ".a{top:0}.b{top:0}")).toBe(-1);
  });

  test("points at the first character where two sheets swap places", () => {
    expect(findFirstDifference(".a{top:0}.b{top:0}", ".b{top:0}.a{top:0}")).toBe(1);
  });

  test("points at the end of the shorter text when a sheet is missing", () => {
    expect(findFirstDifference(".a{top:0}.b{top:0}", ".a{top:0}")).toBe(9);
  });
});
