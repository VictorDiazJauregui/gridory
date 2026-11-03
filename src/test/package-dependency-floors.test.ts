import { describe, expect, test } from "vitest";
import manifestSource from "../../package.json?raw";

interface PackageManifest {
  dependencies: Record<string, string>;
}

class UnsupportedRangeError extends Error {
  constructor(range: string) {
    super(`Only caret ranges like ^1.2.3 can be checked, got "${range}"`);
    this.name = "UnsupportedRangeError";
  }
}

// An old lockfile keeps whatever the range allows, so the floor itself must exclude the releases with advisories:
// GHSA-cg2g-xh64-v4q7, GHSA-mrv2-3pqr-j5jr, GHSA-c6gr-qvv4-5v3f (dompurify), GHSA-gfr2-rv44-r23c, GHSA-vfgh-jcmw-g37q (markdown-it).
const FIRST_SAFE_VERSIONS: Record<string, string> = { dompurify: "3.4.17", "markdown-it": "15.0.3" };
const CARET_RANGE = /^\^(\d+)\.(\d+)\.(\d+)$/;

const parseVersion = (version: string): number[] => version.split(".").map(Number);

const readCaretFloor = (range: string): number[] => {
  const match = CARET_RANGE.exec(range);
  if (!match) throw new UnsupportedRangeError(range);
  return match.slice(1).map(Number);
};

const compareVersions = (left: number[], right: number[]): number =>
  left.reduce((order, part, index) => order || part - right[index], 0);

const { dependencies } = JSON.parse(manifestSource) as PackageManifest;

describe("published dependency floors", () => {
  test.each(Object.entries(FIRST_SAFE_VERSIONS))("%s cannot resolve a release with a known advisory", (name, firstSafe) => {
    const floor = readCaretFloor(dependencies[name]);
    expect(compareVersions(floor, parseVersion(firstSafe))).toBeGreaterThanOrEqual(0);
  });

  test("a range that is not a caret range is reported instead of passing", () => {
    expect(() => readCaretFloor(">=3.4.17")).toThrow(UnsupportedRangeError);
  });
});
