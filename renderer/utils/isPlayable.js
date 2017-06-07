import path from 'path';

function getFileExtension(file) {
  const name = typeof file === 'string' ? file : file.name;
  return path.extname(name).toLowerCase();
}

export function isAudio(file) {
  return ['.aac', '.ac3', '.mp3', '.ogg', '.wav', '.flac', '.m4a'].includes(getFileExtension(file));
}

export function isImage(file) {
  return ['.jpg', '.jpeg', '.png', '.gif'].includes(getFileExtension(file));
}

// Checks whether a fileSummary or file path is playable video
export function isVideo(file) {
  return ['.avi', '.m4v', '.mkv', '.mov', '.mp4', '.mpg', '.ogv', '.webm', '.wmv'].includes(
    getFileExtension(file),
  );
}

export default function (file) {
  return isVideo(file) || isAudio(file) || isImage(file);
}
