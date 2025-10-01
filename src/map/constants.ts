// Map-related constants and shared configuration
export const LIGHTING_DATE = new Date("2025-10-16T14:00:00Z");

// Desktop baseline label list
export const WATER_FEATURE_LABELS: [string, number, number, string][] = [
  ["Mooney Falls", -112.70833786242883, 36.26303280912727, "#008000"],
  ["Havasu Falls", -112.69780748683118, 36.25516624541603, "#0080ff"],
  ["Beaver Falls", -112.73066655202422, 36.282067669997, "#009999"],
  ["Fifty Foot Falls", -112.69867618547715, 36.247284871102075, "#ff9900"],
  ["Navajo Falls", -112.69705389338993, 36.24939147427406, "#cc33ff"],
  ["Fern Spring", -112.70256432267234, 36.25693086823788, "#66cc66"],
  ["The Confluence", -112.76325240470602, 36.30807852398987, "#d4af37"],
];

export const IS_MOBILE =
  typeof window !== "undefined" &&
  ((window.matchMedia && window.matchMedia("(max-width: 640px)").matches) ||
    /Mobi|Android/i.test(navigator.userAgent));
