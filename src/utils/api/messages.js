// src/utils/api/messages.js
export async function replyToMessage(messageId, body, token) {
  const res = await fetch(`/api/messages/${messageId}/reply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ body }),
  });
  if (!res.ok) {
    let errMsg = "Failed to send reply";
    try {
      const data = await res.json();
      errMsg = data?.message || errMsg;
    } catch {}
    throw new Error(errMsg);
  }
  return res.json();
}

export async function getAdminMessages(token) {
  const res = await fetch(`/api/messages/for-admin`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}
