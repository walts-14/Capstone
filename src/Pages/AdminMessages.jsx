import { useEffect, useState } from "react";
import { getAdminMessages } from "../utils/api/messages";

export default function AdminMessages({ token, socket }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAdminMessages(token)
      .then((data) => {
        if (!mounted) return;
        setMessages(Array.isArray(data) ? data : data?.data || []);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e.message || "Failed to load messages");
      })
      .finally(() => mounted && setLoading(false));

    if (socket) {
      const onNew = (msg) => setMessages((prev) => [msg, ...prev]);
      socket.on("newMessage", onNew);
      return () => {
        socket.off("newMessage", onNew);
      };
    }
    return () => {
      mounted = false;
    };
  }, [token, socket]);

  const handleReplySent = (reply) => {
    setMessages((prev) => [reply, ...prev]);
  };

  if (loading) return <div>Loading messages…</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <h2>Messages from Super Admin</h2>
      {messages.length === 0 && <div>No messages</div>}
      {messages.map((m) => (
        <div key={m._id} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 8 }}>
          <div style={{ fontWeight: "bold" }}>{m.title}</div>
          <div style={{ whiteSpace: "pre-wrap" }}>{m.body}</div>
          <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
            From: {m.senderId?.name || m.senderEmail || m.senderRole}
          </div>
          {(m.recipientRole === "admin" || m.isBroadcast) && (
            <MessageReplyForm message={m} token={token} onSent={handleReplySent} />
          )}
        </div>
      ))}
    </div>
  );
}