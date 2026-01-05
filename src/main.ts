const CAMERA_STORAGE_KEY = 'face-lines-camera';

const video = document.getElementById('video') as HTMLVideoElement;
const cameraSelect = document.getElementById('cameraSelect') as HTMLSelectElement;

let currentStream: MediaStream | null = null;

async function enumerateCameras(): Promise<MediaDeviceInfo[]> {
  // Request permission first to get device labels
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

  // Restore saved preference
  const savedId = localStorage.getItem(CAMERA_STORAGE_KEY);
  if (savedId && cameras.some(c => c.deviceId === savedId)) {
    cameraSelect.value = savedId;
  }
}

async function startCamera(deviceId: string) {
  // Stop existing stream
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

async function init() {
  const cameras = await enumerateCameras();

  if (cameras.length === 0) {
    console.error('No cameras found');
    return;
  }

  populateCameraSelect(cameras);

  // Start with selected camera
  await startCamera(cameraSelect.value);

  // Handle camera change
  cameraSelect.addEventListener('change', () => {
    startCamera(cameraSelect.value);
  });
}

init();
