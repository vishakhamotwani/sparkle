/**
 * Rasterize a stage SVG to a PNG download.
 *
 * The SVG is cloned so editing affordances (ghost slots, hit areas — anything
 * marked data-export-hide) can be stripped, and explicit width/height are set
 * because Firefox refuses to drawImage an SVG without them.
 */
export async function exportStagePng(
  svg: SVGSVGElement,
  filename: string,
  { background = "#fff5fa", size = 1024 } = {},
): Promise<void> {
  const viewBox = svg.viewBox.baseVal;
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.querySelectorAll("[data-export-hide]").forEach((el) => el.remove());
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(viewBox.width));
  clone.setAttribute("height", String(viewBox.height));

  const xml = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(
    new Blob([xml], { type: "image/svg+xml;charset=utf-8" }),
  );
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Could not render stage SVG"));
      image.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = Math.round((size * viewBox.height) / viewBox.width);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Signature watermark along the bottom edge.
    ctx.font = `600 ${Math.round(size * 0.026)}px -apple-system, "Segoe UI", system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "rgba(199, 21, 133, 0.45)";
    ctx.fillText(
      "Made with Sparkle Studio ✨",
      canvas.width / 2,
      canvas.height - size * 0.018,
    );

    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}
