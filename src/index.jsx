import { StrictMode, useRef, useEffect, useState } from "react";
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

// Modular imports replacing inline logic
import { useTrailSetup } from "./map/useTrailSetup";
import { IS_MOBILE } from "./map/constants";

function App() {
  const sceneRef = useRef(null);
  const elevationProfileRef = useRef(null);
  const addedGraphicsRef = useRef([]);
  const trailLayerRef = useRef(null);
  const supaiLayerRef = useRef(null);
  const initializedRef = useRef(false);
  const [trailFeature, setTrailFeature] = useState(null);
  const [showElevation, setShowElevation] = useState(false);
  const daylightExpandRef = useRef(null);
  const elevationExpandRef = useRef(null);

  const handleViewReady = useTrailSetup({
    elevationProfileRef,
    setTrailFeature,
    setShowElevation,
    addedGraphicsRef,
    trailLayerRef,
    supaiLayerRef,
    initializedRef,
  });

  // Cleanup on unmount: remove added graphics and layers
  useEffect(() => {
    return () => {
      try {
        if (sceneRef.current && sceneRef.current.view) {
          const view = sceneRef.current.view;
          if (addedGraphicsRef.current.length) {
            addedGraphicsRef.current.forEach((g) => view.graphics.remove(g));
          }
          if (
            trailLayerRef.current &&
            view.map?.layers.includes(trailLayerRef.current)
          ) {
            view.map.layers.remove(trailLayerRef.current);
          }
          if (
            supaiLayerRef.current &&
            view.map?.layers.includes(supaiLayerRef.current)
          ) {
            view.map.layers.remove(supaiLayerRef.current);
          }
        }
      } catch (e) {
        console.warn("Cleanup failed", e);
      }
    };
  }, []);
  // Assign elevation profile input after component is mounted and feature loaded
  useEffect(() => {
    if (showElevation && trailFeature && elevationProfileRef.current) {
      try {
        elevationProfileRef.current.input = trailFeature;
        console.log("Elevation profile input assigned after render");
      } catch (e) {
        console.warn("Failed to assign elevation profile input", e);
      }
    }
  }, [showElevation, trailFeature]);

  // Control expand widget open/closed state via element property (attribute presence would always truthy)
  useEffect(() => {
    if (daylightExpandRef.current) {
      // Expanded only on non-mobile
      daylightExpandRef.current.expanded = !IS_MOBILE;
    }
    if (elevationExpandRef.current) {
      elevationExpandRef.current.expanded = !IS_MOBILE && showElevation;
    }
  }, [showElevation]);

  const handleViewClick = (event) => {
    const view = event.target;
    if (!view) return;
    console.log("camera:", view.camera);
  };

  return (
    <arcgis-scene
      basemap="satellite"
      ground="world-elevation"
      camera-position="-112.71394748101031,36.155953133252986,2150"
      camera-tilt="48.17737504912954"
      camera-heading="33.56078225349284"
      environment-lighting-type="sun"
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
        ref={daylightExpandRef}
        tooltip="Sun & Shadows"
      >
        <arcgis-daylight
          slot="content"
          date-or-season="date"
          visible-elements='{ "datePicker": true, "seasonPicker": false, "timeSlider": true, "playButton": true }'
        />
      </arcgis-expand>
      <arcgis-basemap-toggle position="bottom-right" next-basemap="topo-3d" />
      {showElevation && (
        <arcgis-expand
          position="bottom-left"
          ref={elevationExpandRef}
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
      )}
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
