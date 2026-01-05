import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

let faceLandmarker: FaceLandmarker | null = null;

export async function initFaceMesh(): Promise<FaceLandmarker> {
  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
  );

  faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
      delegate: 'GPU'
    },
    runningMode: 'VIDEO',
    numFaces: 1,
    outputFaceBlendshapes: false,
    outputFacialTransformationMatrixes: false
  });

  console.log('Face mesh initialized');
  return faceLandmarker;
}

export function detectFace(video: HTMLVideoElement, timestamp: number) {
  if (!faceLandmarker) {
    return null;
  }

  const results = faceLandmarker.detectForVideo(video, timestamp);
  return results.faceLandmarks?.[0] || null;
}

export function getFaceLandmarker(): FaceLandmarker | null {
  return faceLandmarker;
}
