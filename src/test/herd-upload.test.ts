import { describe, expect, it } from "vitest";
import { validateVideoDuration } from "../lib/herd-upload";
describe("Herd upload limit", () => {
  it("accepts a video exactly three minutes long", () => expect(validateVideoDuration(180)).toBeNull());
  it("rejects a video longer than three minutes", () => expect(validateVideoDuration(181)).toBe("Videos must be 3 minutes or less."));
});