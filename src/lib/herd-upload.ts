export const MAX_VIDEO_SECONDS = 180;
export function validateVideoDuration(seconds: number): string | null {
  if (!Number.isFinite(seconds) || seconds <= 0) return "This video could not be read. Pick another video.";
  return seconds > MAX_VIDEO_SECONDS ? "Videos must be 3 minutes or less." : null;
}