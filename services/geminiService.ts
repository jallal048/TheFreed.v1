// Lightweight client-side watermark utility to avoid missing import errors
// Applies a simple text watermark on the provided image data URL and returns a new data URL

export async function applyWatermark(dataUrl: string, watermarkText: string): Promise<string> {
  try {
    const baseImage = await loadImage(dataUrl);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return dataUrl;

    canvas.width = baseImage.naturalWidth || baseImage.width;
    canvas.height = baseImage.naturalHeight || baseImage.height;

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // Watermark styling
    const fontSize = Math.max(16, Math.floor(canvas.width * 0.025));
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = Math.max(2, Math.floor(fontSize / 8));

    const padding = Math.max(12, Math.floor(canvas.width * 0.02));
    const text = watermarkText || 'TheFreed';
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const x = canvas.width - textWidth - padding;
    const y = canvas.height - padding;

    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);

    return canvas.toDataURL('image/jpeg', 0.9);
  } catch (e) {
    console.error('applyWatermark failed:', e);
    return dataUrl;
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
