import { StrictMode, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// Individual imports for each component used in this sample
import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-basemap-toggle";
import "@arcgis/map-components/components/arcgis-search";
import "@arcgis/map-components/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-daylight";
import "@arcgis/map-components/components/arcgis-elevation-profile";
import "@arcgis/map-components/components/arcgis-navigation-toggle";
import "@arcgis/map-components/components/arcgis-compass";
import "@arcgis/map-components/components/arcgis-expand";

// Core API import
import Graphic from "@arcgis/core/Graphic.js";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";

import { useCallback } from "react";

function App() {
  const sceneRef = useRef(null);
  const elevationProfileRef = useRef(null);
  const handleViewReady = useCallback((event) => {
    const view = event.target;
    console.log("viewReady event fired", view);
    if (view) {
      view.environment.lighting = {
        type: "sun", // autocasts as new SunLighting()
        date: new Date("2025-10-16T14:00:00Z"),
        directShadowsEnabled: true,
      };

      // Add trail.json as a GeoJSONLayer

      const base = import.meta.env.BASE_URL || "/";
      const trailLayer = new GeoJSONLayer({
        url: base + "trail.json",
        renderer: {
          type: "simple",
          symbol: {
            type: "simple-line",
            color: "#ff4800",
            width: 3,
          },
        },
      });
      view.map.add(trailLayer);

      // Add Supai polygon layer
      const supaiLayer = new GeoJSONLayer({
        url: base + "supai.json",
        title: "Supai",
        renderer: {
          type: "simple",
          symbol: {
            type: "simple-fill",
            color: [0, 158, 224, 0.18], // semi-transparent blue
            outline: { color: [0, 158, 224, 0.9], width: 2 },
          },
        },
        labelingInfo: [
          {
            labelExpressionInfo: { expression: '"Supai"' },
            symbol: {
              type: "text",
              color: "#ffffff",
              haloColor: "#005b80",
              haloSize: 2,
              font: { size: 14, weight: "bold" },
            },
            labelPlacement: "center-center",
          },
        ],
      });
      view.map.add(supaiLayer);

      // Add waterfall/falls point labels as 3D text symbols
      const fallsLabels = [
        {
          longitude: -112.70833786242883,
          latitude: 36.26303280912727,
          text: "Mooney Falls",
          color: "#008000",
        },
        {
          longitude: -112.69780748683118,
          latitude: 36.25516624541603,
          text: "Havasu Falls",
          color: "#0080ff",
        },
        {
          longitude: -112.73066655202422,
          latitude: 36.282067669997,
          text: "Beaver Falls",
          color: "#009999",
        },
        {
          longitude: -112.69867618547715,
          latitude: 36.247284871102075,
          text: "Fifty Foot Falls",
          color: "#ff9900", // chosen distinct orange; adjust if you have a palette
        },
        {
          longitude: -112.69705389338993,
          latitude: 36.24939147427406,
          text: "Navajo Falls",
          color: "#cc33ff", // distinctive purple; adjust as desired
        },
        {
          longitude: -112.70256432267234,
          latitude: 36.25693086823788,
          text: "Fern Spring",
          color: "#66cc66", // soft green distinct from Mooney Falls
        },
        {
          longitude: -112.76325240470602,
          latitude: 36.30807852398987,
          text: "The Confluence",
          color: "#d4af37", // gold tone for prominence
        },
      ];

      const labelGraphics = fallsLabels.map(
        (f) =>
          new Graphic({
            geometry: {
              type: "point",
              longitude: f.longitude,
              latitude: f.latitude,
            },
            symbol: {
              type: "point-3d",
              verticalOffset: {
                screenLength: 50,
                minWorldLength: 20,
                maxWorldLength: 500,
              },
              callout: { type: "line", size: 1.5, color: f.color },
              symbolLayers: [
                {
                  type: "text",
                  text: f.text,
                  material: { color: f.color },
                  halo: { color: "#000000", size: 1 },
                  size: 14,
                  font: { weight: "bold" },
                },
              ],
            },
            attributes: { label: f.text, category: "falls" },
            popupTemplate: { title: f.text },
          })
      );

      view.graphics.addMany(labelGraphics);

      // We'll add start/end graphics directly to view.graphics using 3D symbols with TextSymbol3DLayer

      // Once the trail layer is loaded, derive start/end points
      trailLayer.when(async () => {
        try {
          const { features } = await trailLayer.queryFeatures({
            where: "1=1",
            returnGeometry: true,
            outFields: [],
            num: 1, // assuming single feature
          });
          if (!features?.length) return;
          const path = features[0];
          const geom = features[0].geometry;
          if (geom.type !== "polyline") return;
          const paths = geom.paths;
          if (!paths?.length) return;
          const firstPath = paths[0];
          const lastPath = paths[paths.length - 1];
          const startCoord = firstPath[0];
          const endCoord = lastPath[lastPath.length - 1];

          const coordToPoint = (coord) => ({
            type: "point",
            longitude: coord[0],
            latitude: coord[1],
            ...(coord.length > 2 ? { z: coord[2] } : {}),
          });

          const startGraphic = new Graphic({
            geometry: coordToPoint(startCoord),
            symbol: {
              type: "point-3d",
              verticalOffset: {
                screenLength: 60,
                minWorldLength: 20,
              },
              callout: { type: "line", size: 1.5, color: "#00c853" },
              symbolLayers: [
                {
                  type: "text",
                  text: "Trailhead",
                  material: { color: "#00c853" },
                  halo: { color: "#000000", size: 1 },
                  size: 14,
                  font: { weight: "bold" },
                },
              ],
            },
            attributes: { label: "Trailhead" },
            popupTemplate: { title: "Trail Start" },
          });

          const endGraphic = new Graphic({
            geometry: coordToPoint(endCoord),
            symbol: {
              type: "point-3d",
              verticalOffset: {
                screenLength: 40,
                maxWorldLength: 500,
                minWorldLength: 20,
              },
              callout: { type: "line", size: 1.5, color: "#ff1744" },
              symbolLayers: [
                {
                  type: "text",
                  text: "Campground",
                  material: { color: "#ff1744" },
                  halo: { color: "#000000", size: 1 },
                  size: 14,
                  font: { weight: "bold" },
                },
              ],
            },
            attributes: { label: "Campground" },
            popupTemplate: { title: "Trail End" },
          });

          view.graphics.addMany([startGraphic, endGraphic]);

          // Set the elevation profile input to the trail geometry
          if (elevationProfileRef.current) {
            try {
              // Directly assign the polyline geometry
              elevationProfileRef.current.input = path;
              console.log("Elevation profile input set to trail polyline");
            } catch (e) {
              console.warn(
                "Failed setting elevation profile input directly, retrying async",
                e
              );
              setTimeout(() => {
                try {
                  elevationProfileRef.current &&
                    (elevationProfileRef.current.input = path);
                } catch (_) {}
              }, 100);
            }
          }
        } catch (err) {
          console.error("Failed to create start/end markers", err);
        }
      });
    }
  });

  const handleViewClick = useCallback((event) => {
    const view = event.target;
    const mapPoint = event.detail.mapPoint;
    console.log("camera:", view.camera);
  });

  return (
    <arcgis-scene
      basemap="satellite"
      ground="world-elevation"
      camera-position="-112.71244473769023,36.15778201364935,1932"
      camera-tilt="48.1795698050927"
      camera-heading="33.561668869101176"
      environment-lighting-type="sun"
      environment-lighting-date="2025-10-16T14:00:00Z"
      environment-lighting-direct-shadows-enabled="true"
      ref={sceneRef}
      onarcgisViewClick={handleViewClick}
      onarcgisViewReadyChange={handleViewReady}
    >
      <arcgis-zoom position="top-left"></arcgis-zoom>
      <arcgis-navigation-toggle position="top-left"></arcgis-navigation-toggle>
      <arcgis-compass position="top-left"></arcgis-compass>
      <arcgis-search position="top-right" />
      <arcgis-expand
        position="top-right"
        expanded="false"
        tooltip="Sun & Shadows"
      >
        <arcgis-daylight
          slot="content"
          date-or-season="date"
          visible-elements='{ "datePicker": true, "seasonPicker": false, "timeSlider": true, "playButton": true }'
        />
      </arcgis-expand>
      <arcgis-basemap-toggle position="bottom-right" next-basemap="topo-3d" />
      <arcgis-expand
        position="bottom-left"
        expanded="false"
        tooltip="Elevation Profile"
      >
        <arcgis-elevation-profile
          slot="content"
          ref={elevationProfileRef}
          unit="imperial"
          hideSelectButton={true}
          highlightEnabled={false}
        />
      </arcgis-expand>
    </arcgis-scene>
  );
}

// Mount the app
const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
