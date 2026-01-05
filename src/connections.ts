// Face mesh landmark connections
// Based on MediaPipe Face Mesh tessellation
// Each pair is [startIndex, endIndex] representing a line between two landmarks

import { FaceLandmarker } from '@mediapipe/tasks-vision';

// Use MediaPipe's built-in connection definitions
export const FACE_CONNECTIONS = FaceLandmarker.FACE_LANDMARKS_TESSELATION;
export const FACE_OVAL = FaceLandmarker.FACE_LANDMARKS_FACE_OVAL;
export const LIPS = FaceLandmarker.FACE_LANDMARKS_LIPS;
export const LEFT_EYE = FaceLandmarker.FACE_LANDMARKS_LEFT_EYE;
export const RIGHT_EYE = FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE;
export const LEFT_EYEBROW = FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW;
export const RIGHT_EYEBROW = FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW;
export const LEFT_IRIS = FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS;
export const RIGHT_IRIS = FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS;
