/// <reference types="vite/client" />
import { useCallback } from "react";
import { WATER_FEATURE_LABELS, IS_MOBILE, LIGHTING_DATE } from "./constants";
import { makeTextGraphic, makeEndpointGraphic } from "./graphics";
import { createTrailLayer, createSupaiLayer } from "./layers";

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
      view.map.addMany([trailLayer, supaiLayer]);
      trailLayerRef.current = trailLayer;
      supaiLayerRef.current = supaiLayer;

      const waterGraphics = WATER_FEATURE_LABELS.map(([t, lon, lat, c]) =>
        makeTextGraphic(t, lon, lat, c)
      );
      view.graphics.addMany(waterGraphics);
      addedGraphicsRef.current.push(...waterGraphics);

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
            const firstPath = geom.paths[0];
            const lastPath = geom.paths[geom.paths.length - 1];
            const startCoord = firstPath[0];
            const endCoord = lastPath[lastPath.length - 1];
            const startGraphic = makeEndpointGraphic(
              "Trailhead",
              "#00c853",
              startCoord,
              60
            );
            const endGraphic = makeEndpointGraphic(
              "Campground",
              "#ff1744",
              endCoord,
              40
            );
            view.graphics.addMany([startGraphic, endGraphic]);
            addedGraphicsRef.current.push(startGraphic, endGraphic);
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
