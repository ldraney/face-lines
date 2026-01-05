import { initFaceMesh, detectFace } from './face-mesh';
import { render } from './renderer';
import { FACE_CONNECTIONS } from './connections';

const CAMERA_STORAGE_KEY = 'face-lines-camera';

const video = document.getElementById('video') as HTMLVideoElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const cameraSelect = document.getElementById('cameraSelect') as HTMLSelectElement;
const ctx = canvas.getContext('2d')!;

let currentStream: MediaStream | null = null;
let isRunning = false;
let ws: WebSocket | null = null;

function connectWebSocket() {
  ws = new WebSocket('ws://localhost:8081');
  ws.onopen = () => console.log('WebSocket connected');
  ws.onclose = () => {
    console.log('WebSocket disconnected, reconnecting...');
    setTimeout(connectWebSocket, 1000);
  };
}

async function enumerateCameras(): Promise<MediaDeviceInfo[]> {
  try {
    const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
    tempStream.getTracks().forEach(track => track.stop());
  } catch (e) {
    console.error('Camera permission denied:', e);
  }

  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter(device => device.kind === 'videoinput');
}

function populateCameraSelect(cameras: MediaDeviceInfo[]) {
  cameraSelect.innerHTML = '';

  cameras.forEach((camera, index) => {
    const option = document.createElement('option');
    option.value = camera.deviceId;
    option.textContent = camera.label || `Camera ${index + 1}`;
    cameraSelect.appendChild(option);
  });

  const savedId = localStorage.getItem(CAMERA_STORAGE_KEY);
  if (savedId && cameras.some(c => c.deviceId === savedId)) {
    cameraSelect.value = savedId;
  }
}

async function startCamera(deviceId: string) {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }

  try {
    currentStream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: { exact: deviceId },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    });

    video.srcObject = currentStream;
    localStorage.setItem(CAMERA_STORAGE_KEY, deviceId);
    console.log('Camera started:', deviceId);
  } catch (e) {
    console.error('Failed to start camera:', e);
  }
}

function startDetectionLoop() {
  if (isRunning) return;
  isRunning = true;

  function loop() {
    if (!isRunning) return;

    if (video.readyState >= 2) {
      const landmarks = detectFace(video, performance.now());

      if (landmarks) {
        render(ctx, landmarks, FACE_CONNECTIONS, {
          lineColor: '#00ff00',
          lineWidth: 3
        });
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(landmarks));
        }
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(null));
        }
      }
    }

    requestAnimationFrame(loop);
  }

  loop();
}

async function init() {
  const cameras = await enumerateCameras();

  if (cameras.length === 0) {
    console.error('No cameras found');
    return;
  }

  populateCameraSelect(cameras);
  await startCamera(cameraSelect.value);

  cameraSelect.addEventListener('change', () => {
    startCamera(cameraSelect.value);
  });

  console.log('Loading face mesh model...');
  await initFaceMesh();
  console.log('Starting detection loop...');

  video.addEventListener('loadeddata', () => {
    startDetectionLoop();
  });

  if (video.readyState >= 2) {
    startDetectionLoop();
  }
}

// Auto-start
connectWebSocket();
init();
