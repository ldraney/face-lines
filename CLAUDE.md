# Face Lines - Live Face Digitizer

## Project Goal
Live face digitizer: captures webcam/phone input, detects facial landmarks, renders as wireframe lines on transparent canvas.

## Tech Stack
- Vite + TypeScript (vanilla, no framework)
- MediaPipe Face Mesh (`@mediapipe/tasks-vision`)
- HTML Canvas for rendering

## Pipeline
```
Camera (iPhone via Camo, or webcam)
  → getUserMedia()
  → MediaPipe Face Mesh (468 landmarks)
  → Canvas draw lines between landmarks
  → Transparent background output
```

## Current Status
- [x] Milestone 1: Camera connection (dropdown, localStorage, live feed)
- [ ] Milestone 2: Face mesh detection + line rendering

## File Structure
```
face-lines/
├── index.html           # Canvas + camera dropdown
├── src/
│   ├── main.ts          # Entry, camera setup, main loop
│   ├── face-mesh.ts     # MediaPipe FaceLandmarker (TODO)
│   ├── renderer.ts      # Canvas line drawing (TODO)
│   └── connections.ts   # Landmark connections (TODO)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── CLAUDE.md
```

## Dev Commands
```bash
npm install
npm run dev    # localhost:5173
```

## Implementation Notes

### Camera Selection (`src/main.ts`)
- Enumerates devices, populates dropdown
- Saves preference to localStorage
- Supports Camo (iPhone as webcam)

### Face Mesh (TODO: `src/face-mesh.ts`)
- `@mediapipe/tasks-vision` FaceLandmarker
- VIDEO mode for continuous detection
- 468 landmarks per face

### Rendering (TODO: `src/renderer.ts`)
- Clear canvas to transparent each frame
- Draw lines between landmark connections
- Configurable line color/width

### Transparency
- CSS: `background: transparent` on body and canvas
- Ready for use as overlay source
