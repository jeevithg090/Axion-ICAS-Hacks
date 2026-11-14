import { describe, expect, it } from "vitest";
import { inferFilename, sanitizeFilename } from "./audio";

describe("inferFilename", () => {
  it.each([
    ["audio/wav", "meeting.wav"],
    ["audio/mpeg", "meeting.mp3"],
    ["audio/mp4", "meeting.m4a"],
    ["audio/ogg; codecs=opus", "meeting.ogg"],
    ["audio/webm", "meeting.webm"],
    ["application/octet-stream", "meeting.bin"],
    [undefined, "meeting.bin"],
  ])("%s -> %s", (type, expected) => {
    expect(inferFilename(type, "meeting")).toBe(expected);
  });
});

describe("sanitizeFilename", () => {
  it("removes path components and unsafe characters", () => {
    expect(sanitizeFilename("../../etc/passwd")).toBe("passwd");
    expect(sanitizeFilename("C:\\Users\\me\\talk.mp3")).toBe("talk.mp3");
    expect(sanitizeFilename('we"ird<name>.wav')).toBe("we_ird_name_.wav");
  });

  it("returns undefined for empty names", () => {
    expect(sanitizeFilename(undefined)).toBeUndefined();
    expect(sanitizeFilename("")).toBeUndefined();
    expect(sanitizeFilename("///")).toBeUndefined();
  });
});
