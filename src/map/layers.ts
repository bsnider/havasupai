import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";

export function createTrailLayer(url: string) {
  return new GeoJSONLayer({
    url,
    title: "Trail",
    elevationInfo: {
      mode: "on-the-ground",
    },
    renderer: {
      type: "simple",
      symbol: { type: "simple-line", color: "#ff4800", width: 3 },
    },
  });
}

export function createSupaiLayer(url: string) {
  return new GeoJSONLayer({
    url,
    title: "Supai",
    elevationInfo: {
      mode: "on-the-ground",
    },
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [0, 158, 224, 0.18],
        outline: { color: [0, 158, 224, 0.9], width: 2 },
      },
    },
    labelingInfo: [
      {
        labelExpressionInfo: { expression: '"Supai"' },
        symbol: {
          type: "text",
          color: "#ffffff",
          haloColor: "#00c853",
          haloSize: 2,
          font: { size: 14, weight: "bold" },
        },
      },
    ],
  });
}

export function createCampgroundsLayer(url: string) {
  return new GeoJSONLayer({
    url,
    title: "Campgrounds",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [0, 158, 224, 0.18],
        outline: { color: [0, 158, 224, 0.9], width: 2 },
      },
    },
    labelingInfo: [
      {
        labelExpressionInfo: { expression: '"Campground"' },
        symbol: {
          type: "text",
          color: "#ffffff",
          haloColor: "#00c853",
          haloSize: 2,
          font: { family: "Arial", size: 12, weight: "bold" },
        },
      },
    ],
  });
}
