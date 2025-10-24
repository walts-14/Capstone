import React from "react";

export default function QRModal({ visible, onClose, dataUrl, magicUrl, studentEmail }) {
  if (!visible) return null;

  const download = () => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${studentEmail || "qr"}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const printImage = () => {
    const w = window.open();
    w.document.write(`<img src="${dataUrl}" onload="window.print(); window.close();" />`);
    w.document.close();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(magicUrl);
      alert("Link copied to clipboard");
    } catch {
      alert("Unable to copy link");
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, display: "flex", justifyContent: "center", alignItems: "center",
      background: "rgba(0,0,0,0.4)", zIndex: 5000
    }}>
      <div style={{ background: "#fff", padding: 20, borderRadius: 8, width: 360, textAlign: "center" }}>
        <h3>Student QR Code</h3>
        <div style={{ margin: "12px 0", display: "flex", justifyContent: "center" }}>
          <img src={dataUrl} alt="QR" style={{ width: 220, height: 220, display: "block", margin: "0 auto" }} />
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
          <button onClick={download} className="btn btn-primary">Download</button>
          <button onClick={printImage} className="btn btn-secondary">Print</button>
          <button onClick={copyLink} className="btn btn-outline-secondary">Copy link</button>
        </div>
        <div style={{ marginTop: 12 }}>
          <small>Magic link (expires soon):</small>
          <div style={{ overflowWrap: "anywhere", marginTop: 6 }}>
            <a href={magicUrl} target="_blank" rel="noreferrer">{magicUrl}</a>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <button className="btn btn-danger" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
