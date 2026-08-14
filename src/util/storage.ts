// Narrowing helpers for the localStorage boundary, where every read is `string | null`.
// Keeps the parsing in one place instead of scattering `?? fallback` across components.

export const numOr = (raw: string | null, fallback: number): number =>
  raw == null || raw === "" || Number.isNaN(Number(raw)) ? fallback : Number(raw);

export const strOr = (raw: string | null, fallback: string): string =>
  raw == null || raw === "null" || raw === "" ? fallback : raw;
