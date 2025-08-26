import QRCode from "qrcode";

async function toDataUrl(text) {
  return QRCode.toDataURL(text, { errorCorrectionLevel: "M", margin: 1, scale: 6 });
}

async function toPngBuffer(text) {
  return QRCode.toBuffer(text, { errorCorrectionLevel: "M", margin: 1, scale: 6, type: "png" });
}

export { toDataUrl, toPngBuffer };   // ✅ ES export
