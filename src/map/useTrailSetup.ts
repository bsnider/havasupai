/// <reference types="vite/client" />
import { useCallback } from "react";
import {
  FEATURE_LABELS,
  IS_MOBILE,
  LIGHTING_DATE,
  TARGET_CAMERA,
} from "./constants";
import { makeTextGraphic } from "./graphics";
import { createTrailLayer, createSupaiLayer } from "./layers";
import { createCampgroundsLayer } from "./layers";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";

/**
 * Hook that returns a viewReady handler to set up layers, graphics, endpoints, and elevation input.
 */
export function useTrailSetup(options: {
  elevationProfileRef: React.RefObject<any>;
  setTrailFeature: (g: any) => void;
  setShowElevation: (b: boolean) => void;
  addedGraphicsRef: React.MutableRefObject<any[]>;
  trailLayerRef: React.MutableRefObject<any>;
  supaiLayerRef: React.MutableRefObject<any>;
  initializedRef: React.MutableRefObject<boolean>;
}) {
  const {
    elevationProfileRef,
    setTrailFeature,
    setShowElevation,
    addedGraphicsRef,
    trailLayerRef,
    supaiLayerRef,
    initializedRef,
  } = options;

  return useCallback(
    async (event: any) => {
      const view = event.target;
      if (!view || initializedRef.current) return;
      initializedRef.current = true;

      view.environment.lighting = {
        type: "sun",
        date: LIGHTING_DATE,
        directShadowsEnabled: !IS_MOBILE,
      } as any;

      try {
        if (IS_MOBILE) (view as any).qualityProfile = "low";
      } catch {
        /* ignore */
      }

      const base = import.meta.env.BASE_URL || "/";
      const trailLayer = createTrailLayer(base + "trail.json");
      const supaiLayer = createSupaiLayer(base + "supai.json");
      const campgroundsLayer = createCampgroundsLayer(
        base + "campgrounds.json"
      );

      view.map.addMany([trailLayer, supaiLayer, campgroundsLayer]);

      trailLayerRef.current = trailLayer;
      supaiLayerRef.current = supaiLayer;

      const waterGraphics = FEATURE_LABELS.map(([t, lon, lat, c]) =>
        makeTextGraphic(t, lon, lat, c)
      );
      view.graphics.addMany(waterGraphics);
      addedGraphicsRef.current.push(...waterGraphics);

      // Load basemap layers
      try {
        await Promise.all(
          view.map.basemap.baseLayers.map((layer: any) =>
            layer.load().catch(() => {})
          )
        );
      } catch {}

      // Wait until the basemap (initial frame) is fully rendered
      await reactiveUtils.whenOnce(() => !view.updating);

      // Now safe to add labels
      const labelGraphics = FEATURE_LABELS.map(([t, lon, lat, c]) =>
        makeTextGraphic(t, lon, lat, c)
      );
      view.graphics.addMany(labelGraphics);
      addedGraphicsRef.current.push(...labelGraphics);

      // Camera transition only after first render
      view.goTo(TARGET_CAMERA, { duration: 2000 }).catch(() => {});

      try {
        await trailLayer.load();
        const q = trailLayer.createQuery();
        q.where = "1=1";
        q.returnGeometry = true;
        q.outFields = [];
        q.num = 1;
        const { features } = await trailLayer.queryFeatures(q);
        if (features?.length) {
          const geom: any = features[0].geometry;
          if (geom.type === "polyline" && geom.paths?.length) {
            setTrailFeature(features[0]);
            setShowElevation(true);
          }
        }
      } catch (err) {
        console.error("Trail processing error", err);
      }
    },
    [
      addedGraphicsRef,
      setTrailFeature,
      setShowElevation,
      trailLayerRef,
      supaiLayerRef,
      initializedRef,
    ]
  );
}
