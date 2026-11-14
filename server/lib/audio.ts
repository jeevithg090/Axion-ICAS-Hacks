const EXTENSIONS: [needle: string, ext: string][] = [
  ["wav", "wav"],
  ["mpeg", "mp3"],
  ["mp3", "mp3"],
  ["m4a", "m4a"],
  ["mp4", "m4a"],
  ["ogg", "ogg"],
  ["webm", "webm"],
  ["flac", "flac"],
];

/** Builds a filename with an extension matching the given audio content type. */
export function inferFilename(contentType: string | undefined, base = "audio") {
  const type = (contentType ?? "").toLowerCase();
  const ext =
    EXTENSIONS.find(([needle]) => type.includes(needle))?.[1] ?? "bin";
  return `${base}.${ext}`;
}

/** Strips path components and unsafe characters from a client-supplied filename. */
export function sanitizeFilename(name: string | undefined): string | undefined {
  if (!name) return undefined;
  const base = name.split(/[\\/]/).pop() ?? "";
  const cleaned = base
    .replace(/[^\w.\- ]+/g, "_")
    .slice(0, 120)
    .trim();
  return cleaned || undefined;
}
