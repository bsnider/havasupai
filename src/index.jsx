import { StrictMode, useRef, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-basemap-toggle";
import "@arcgis/map-components/components/arcgis-search";
import "@arcgis/map-components/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-elevation-profile";
import "@arcgis/map-components/components/arcgis-navigation-toggle";
import "@arcgis/map-components/components/arcgis-compass";
import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-daylight";

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
  const elevationExpandRef = useRef(null);
  const daylightExpandRef = useRef(null);
  const daylightRef = useRef(null);

  const handleViewReady = useTrailSetup({
    elevationProfileRef,
    setTrailFeature,
    setShowElevation,
    addedGraphicsRef,
    trailLayerRef,
    supaiLayerRef,
    initializedRef,
  });

  useEffect(() => {
    return () => {
      try {
        if (sceneRef.current && sceneRef.current.view) {
          const view = sceneRef.current.view;
          addedGraphicsRef.current.forEach((g) => view.graphics.remove(g));
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

  useEffect(() => {
    // control expand states (desktop expanded, mobile collapsed)
    if (daylightExpandRef.current) {
      daylightExpandRef.current.expanded = !IS_MOBILE;
    }
    if (elevationExpandRef.current) {
      elevationExpandRef.current.expanded = !IS_MOBILE && showElevation;
    }
  }, [showElevation]);

  const handleViewClick = (event) => {
    const mapPoint = event.detail.mapPoint;
    const view = event.target;
    if (!view) return;
    console.log("camera:", view.camera);
    console.log("mapPoint:", mapPoint);
  };

  return (
    <arcgis-scene
      basemap="hybrid"
      ground="world-elevation"
      camera-position="-112.78365367383282,36.28701509558565,373400.886566367"
      camera-tilt="0"
      camera-heading="0"
      ref={sceneRef}
      onarcgisViewClick={handleViewClick}
      onarcgisViewReadyChange={handleViewReady}
    >
      {/* widgets */}
      <arcgis-zoom position="top-left"></arcgis-zoom>
      <arcgis-navigation-toggle position="top-left"></arcgis-navigation-toggle>
      <arcgis-compass position="top-left"></arcgis-compass>
      <arcgis-search position="top-right" />
      <arcgis-basemap-toggle position="bottom-right" next-basemap="topo-3d" />

      {/* Daylight (re-added) */}
      <arcgis-expand
        position="top-right"
        ref={daylightExpandRef}
        tooltip="Sun & Shadows"
        label="Daylight"
        mode="floating" // force floating mode (no drawer scrim)
        autoCollapse={false} // keep state stable
      >
        <arcgis-daylight
          slot="content"
          ref={daylightRef}
          playSpeed="1"
        ></arcgis-daylight>
      </arcgis-expand>

      {/* Elevation profile (conditional) */}
      {showElevation && (
        <arcgis-expand
          position="bottom-left"
          ref={elevationExpandRef}
          tooltip="Elevation Profile"
          label="Elevation Profile"
        >
          <arcgis-elevation-profile
            slot="content"
            mode="floating" // force floating mode (no drawer scrim)
            ref={elevationProfileRef}
            unit="imperial"
            hideSelectButton
            highlightEnabled={false}
          />
        </arcgis-expand>
      )}
    </arcgis-scene>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
