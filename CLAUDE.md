# Face Lines - Live Face Digitizer

## Project Goal
Live face digitizer: captures webcam/phone input, detects facial landmarks, renders as wireframe lines on transparent canvas for OBS overlay.

## Tech Stack
- Vite + TypeScript (vanilla, no framework)
- MediaPipe Face Mesh (`@mediapipe/tasks-vision`)
- HTML Canvas for rendering
- WebSocket + SSE for OBS integration

## Architecture
```
Chrome (localhost:5174)        server.mjs                OBS Browser Source
    │                              │                           │
    │ Camera → Face Detect         │                           │
    │ ──── WebSocket:8081 ───────► │ ◄──── SSE:3000 ────────── │
    │                              │                           │
    └─ Renders locally             └─ Relays landmarks         └─ Renders overlay
```

## Current Status
- [x] Milestone 1: Camera connection (dropdown, localStorage, live feed)
- [x] Milestone 2: Face mesh detection + line rendering (works in Chrome)
- [ ] Milestone 3: OBS overlay via SSE (see issue #2)

## Dev Commands
```bash
npm install
node server.mjs   # Start WebSocket + SSE server (ports 8081 + 3000)
npm run dev       # Start Vite (port 5174)
```

OBS browser source URL: `http://localhost:3000`

## File Structure
```
face-lines/
├── index.html           # Chrome page (camera + face detection)
├── server.mjs           # WebSocket receiver + SSE server for OBS
├── check-obs.mjs        # OBS WebSocket control script
├── src/
│   ├── main.ts          # Entry, camera, detection loop, sends to WS
│   ├── face-mesh.ts     # MediaPipe FaceLandmarker
│   ├── renderer.ts      # Canvas line drawing
│   └── connections.ts   # Landmark connections
├── package.json
├── tsconfig.json
├── vite.config.ts
└── CLAUDE.md
```

## Implementation Notes

### Chrome Side (`src/main.ts`)
- Auto-starts on page load
- Enumerates cameras, saves preference to localStorage
- Runs face detection loop, renders locally
- Sends landmarks via WebSocket to server

### Server (`server.mjs`)
- WebSocket on port 8081: receives landmarks from Chrome
- HTTP + SSE on port 3000: serves render page to OBS
- Relays landmarks to all SSE clients

### OBS Integration
- OBS browser source loads `http://localhost:3000`
- Server serves embedded HTML with canvas + SSE client
- SSE receives landmarks, renders face lines
- Transparent background for overlay

## Known Issues
- Issue #2: SSE data not reaching OBS (connection works, messages don't)
