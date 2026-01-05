import type { NormalizedLandmark, Connection } from '@mediapipe/tasks-vision';

export interface RenderOptions {
  lineColor: string;
  lineWidth: number;
}

const defaultOptions: RenderOptions = {
  lineColor: '#00ff00',
  lineWidth: 1
};

export function render(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  connections: Connection[],
  options: Partial<RenderOptions> = {}
) {
  const opts = { ...defaultOptions, ...options };
  const { width, height } = ctx.canvas;

  // Clear to transparent
  ctx.clearRect(0, 0, width, height);

  // Set line style
  ctx.strokeStyle = opts.lineColor;
  ctx.lineWidth = opts.lineWidth;

  // Draw connections
  ctx.beginPath();
  for (const connection of connections) {
    const start = landmarks[connection.start];
    const end = landmarks[connection.end];

    if (start && end) {
      ctx.moveTo(start.x * width, start.y * height);
      ctx.lineTo(end.x * width, end.y * height);
    }
  }
  ctx.stroke();
}
