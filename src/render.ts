import { render } from './renderer';
import { FACE_CONNECTIONS } from './connections';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const status = document.getElementById('status') as HTMLDivElement;
const ctx = canvas.getContext('2d')!;

let ws: WebSocket | null = null;

function connect() {
  status.textContent = 'Connecting...';
  ws = new WebSocket('ws://localhost:8081');

  ws.onopen = () => {
    status.textContent = 'Connected - waiting for face data';
  };

  ws.onmessage = (event) => {
    try {
      const landmarks = JSON.parse(event.data);
      status.textContent = 'Receiving: ' + (landmarks ? landmarks.length + ' points' : 'null');

      if (landmarks) {
        render(ctx, landmarks, FACE_CONNECTIONS, {
          lineColor: '#00ff00',
          lineWidth: 3
        });
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    } catch (e) {
      status.textContent = 'Error: ' + e;
    }
  };

  ws.onclose = () => {
    status.style.display = 'block';
    status.textContent = 'Disconnected - reconnecting...';
    setTimeout(connect, 1000);
  };

  ws.onerror = () => {
    status.textContent = 'Connection error';
  };
}

connect();
