## Havasupai 3D Trail Viewer (React + Vite + ArcGIS Map Components)

An interactive 3D SceneView of the Havasupai area featuring the main trail, Supai polygon, labeled waterfalls / points of interest, daylight sun/shadow visualization, and an elevation profile (desktop). Built with ArcGIS Maps SDK Web Components + React + Vite and deployable to GitHub Pages.

### Key Features

- 3D satellite scene with world elevation ground
- Havasupai trail (GeoJSON) + start/end 3D labeled endpoints
- Supai village polygon with labeling
- Waterfall / POI 3D text labels (decluttered automatically on mobile if desired)
- Daylight (sun position + shadows) in an Expand panel
- Elevation Profile (auto-expands on desktop, minimized on mobile)
- Basemap toggle (Satellite ↔ Topo 3D)
- Mobile performance adjustments (reduced shadows, quality profile)

### Tech Stack

- React (Vite bundler)
- `@arcgis/map-components` (ArcGIS Maps SDK Web Components) ~4.33
- `@arcgis/core` for direct layer / graphic creation in modular helpers
- TypeScript modules for map setup logic

### Project Structure (Relevant Parts)

```
src/
	index.jsx                Root React entry, hosts <arcgis-scene/>
	map/
		constants.ts           Shared config (dates, mobility detection, labels)
		graphics.ts            Factory helpers for text & endpoint graphics
		layers.ts              GeoJSON layer factory functions
		useTrailSetup.ts       Hook wiring layers, labels, endpoints, elevation
public/
	trail.json               Trail polyline (GeoJSON)
	supai.json               Supai polygon (GeoJSON)
vite.config.js             Base path logic for GitHub Pages deployment
```

### Getting Started (Local Development)

```bash
npm install
npm run dev
```

Your browser should open automatically (Vite dev server). If not, visit: http://localhost:5173 (port may vary).

### Build

```bash
npm run build
```

Outputs production bundle to `dist/`.

### Deployment (GitHub Pages)

1. Ensure repository name in GitHub matches the value of `repoName` in `vite.config.js` (currently: `havasupai-react`).
2. Confirm `isRootSite` is `false` unless deploying to `<user>.github.io` root.
3. Commit & push main branch changes.
4. Run:
   ```bash
   npm run deploy
   ```
   This runs `predeploy` (build) then publishes `dist/` to the `gh-pages` branch via `gh-pages` package.
5. In GitHub repository settings → Pages, verify the source is set to `gh-pages` branch (root). Wait ~1–2 minutes.
6. Site URL: `https://<your-username>.github.io/havasupai-react/`

If you rename the repo, update `repoName` and redeploy.

### Environment / Configuration

| Aspect                | Location                                 | Notes                                      |
| --------------------- | ---------------------------------------- | ------------------------------------------ |
| Lighting date         | `constants.ts` (LIGHTING_DATE)           | Controls sun position in daylight/shadows  |
| Mobile detection      | `constants.ts` (IS_MOBILE)               | Used to disable shadows & collapse Expands |
| Labels                | `constants.ts` (WATER_FEATURE_LABELS)    | Add / remove POI labels here               |
| Trail & Supai sources | `public/trail.json`, `public/supai.json` | Served relative to Vite `base`             |
| Layer / graphic setup | `useTrailSetup.ts`                       | Single source for map initialization       |

### Customizing

Add new POI label:

1. Append an entry to `WATER_FEATURE_LABELS`: `["Label Text", lon, lat, "#color"]`
2. Re-run dev or rebuild for production.

Change the default camera:
Edit `<arcgis-scene ... camera-position="lon,lat,z" camera-tilt="..." camera-heading="..." />` in `index.jsx`.

Disable auto elevation profile expansion on desktop:
Inside `index.jsx`, adjust the effect controlling `elevationExpandRef.current.expanded`.

### Performance Tips

- Limit number of 3D text graphics for low-powered devices.
- Consider using scale-dependent visibility (e.g. symbol size or label class definitions) if adding many more labels.
- Lazy-create heavy widgets only after view is ready.

### Troubleshooting

| Symptom                    | Cause                      | Fix                                                                |
| -------------------------- | -------------------------- | ------------------------------------------------------------------ |
| Blank page on GitHub Pages | Wrong Vite `base`          | Update `repoName` or `isRootSite`, rebuild & deploy                |
| 404 on trail.json          | File path or base mismatch | Ensure file is in `public/` and reference is `base + 'trail.json'` |
| Elevation Profile empty    | Input not assigned yet     | Wait for trail load (desktop auto-expands); check console          |
| Widgets open on mobile     | Boolean attribute parsing  | We now set `.expanded` via refs in an effect                       |

### Roadmap / Ideas

- Layer list / legend integration
- Fly-to buttons for each waterfall
- Offline packaging / caching strategy
- Scale-based label decluttering

### License

Provided as an educational sample. See Esri product licensing for production usage of ArcGIS APIs and data.

### Acknowledgments

ArcGIS Maps SDK for JavaScript team & Havasupai geography inspiration.

---

Feel free to open issues or request enhancements.
