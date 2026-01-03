/**
 * Centralized constants for the AI Playground module.
 * Configuration values and magic numbers should be defined here.
 */

/** Default memory limit for conversation context (number of message pairs) */
export const DEFAULT_MEMORY_LIMIT = 6;

/** Maximum number of images that can be uploaded at once */
export const MAX_IMAGE_UPLOAD = 2;

/** Minimum textarea height in pixels */
export const MIN_TEXTAREA_HEIGHT = 52;

/** Maximum textarea height in pixels */
export const MAX_TEXTAREA_HEIGHT = 150;

/** Animation durations in milliseconds */
export const ANIMATION_DURATION = {
    short: 200,
    medium: 300,
    long: 700,
} as const;

/** Default textarea height for reset */
export const DEFAULT_TEXTAREA_HEIGHT = "32px";

/** Input placeholder text */
export const INPUT_PLACEHOLDER = "Ask anything or describe what you want to build...";
