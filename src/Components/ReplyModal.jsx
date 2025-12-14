import { useState } from "react";
import { replyToMessage } from "../utils/api/messages";
import "../css/ReplyModal.css";

export default function ReplyModal({ message, token, onClose, onSent }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  if (!message) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      const result = await replyToMessage(message._id, text.trim(), token);
      setText("");
      if (onSent) onSent(result.reply);
      onClose();
    } catch (err) {
      alert(err.message || "Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const disabled = sending || !text.trim();

  return (
    <div className="reply-modal-overlay" onClick={onClose}>
      <div className="reply-modal" onClick={(e) => e.stopPropagation()}>
        <div className="reply-modal-header">
          <h3>Reply to Message</h3>
          <button className="reply-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="reply-modal-content">
          <div className="original-message">
            <div className="original-title">{message.title}</div>
            <div className="original-body">{message.body}</div>
            <div className="original-meta">
              From: {message.senderId?.name || message.senderEmail || message.senderRole}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your reply to the Super Admin..."
              rows={3}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd", fontFamily: "inherit" }}
            />
            <button
              type="submit"
              disabled={disabled}
              style={{
                marginTop: "8px",
                padding: "8px 16px",
                background: disabled ? "#ccc" : "#4f46e5",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: disabled ? "not-allowed" : "pointer",
                fontWeight: "bold",
              }}
            >
              {sending ? "Sending..." : "Send Reply"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
