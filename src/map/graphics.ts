import Graphic from "@arcgis/core/Graphic";

export function makeTextGraphic(
  title: string,
  lon: number,
  lat: number,
  color: string
) {
  return new Graphic({
    geometry: { type: "point", longitude: lon, latitude: lat },
    symbol: {
      type: "point-3d",
      verticalOffset: {
        screenLength: 50,
        minWorldLength: 20,
        maxWorldLength: 500,
      },
      callout: { type: "line", size: 1.5, color },
      symbolLayers: [
        {
          type: "text",
          text: title,
          material: { color },
          halo: { color: "#000", size: 1 },
          size: 14,
          font: { weight: "bold" },
        },
      ],
    },
    attributes: { label: title, category: "water-feature" },
    popupTemplate: { title },
  });
}
