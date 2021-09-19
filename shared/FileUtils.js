export default class FileUtils {
  toDataUrl(file) {
    if (!file) {
      return null;
    }
    return `data:image/png;base64, ${file.buffer.toString("base64")}`;
  }
}
