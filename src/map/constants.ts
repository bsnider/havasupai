// Map-related constants and shared configuration
export const LIGHTING_DATE = new Date("2025-10-16T20:00:00Z");

// Desktop baseline label list
export const FEATURE_LABELS: [string, number, number, string][] = [
  ["Campsite", -112.70804196125121, 36.26291511389827, "#ff0000"],
  ["Mooney Falls", -112.70844604196952, 36.263127753313874, "#0080ff"],
  ["Havasu Falls", -112.69780748683118, 36.25516624541603, "#0080ff"],
  ["Beaver Falls", -112.72947884457137, 36.28120347634347, "#0080ff"],
  ["Super Secret Falls", -112.69867618547715, 36.247284871102075, "#0080ff"],
  ["Fifty Foot Falls", -112.70030626129531, 36.24651843302115, "#0080ff"],
  ["Navajo Falls", -112.69705389338993, 36.24939147427406, "#0080ff"],
  ["Fern Spring", -112.70256432267234, 36.25693086823788, "#0080ff"],
  ["The Confluence", -112.76325240470602, 36.30807852398987, "#0080ff"],
  ["The Incident", -114.59626386071403, 34.76927578428712, "#633200"],
  ["Hilltop Trailhead", -112.70912958381884, 36.15996733293846, "#00c853"],
];

export const TARGET_CAMERA = {
  position: {
    x: -12543414.69795861,
    y: 4331011.89300031,
    z: 2702.3458520863205,
    spatialReference: { wkid: 102100, latestWkid: 3857 },
  },
  heading: 329.0423790627999,
  tilt: 75.48650912643205,
};

export const IS_MOBILE =
  typeof window !== "undefined" &&
  ((window.matchMedia && window.matchMedia("(max-width: 640px)").matches) ||
    /Mobi|Android/i.test(navigator.userAgent));
