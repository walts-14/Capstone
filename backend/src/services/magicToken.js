// src/services/magicToken.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { TokenModel } from "../../models/tokenModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "WeSignLetsGo";
const MAGIC_EXP_MIN = Number(process.env.MAGIC_TOKEN_MIN || 15); // minutes

export async function createMagicToken(userId) {
  const jti = uuidv4();
  const payload = { sub: String(userId), jti, purpose: "magic-login" };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: `${MAGIC_EXP_MIN}m` });

  // store hashed jti for single-use invalidation
  const jtiHash = await bcrypt.hash(jti, 10);
  await TokenModel.create({
    jtiHash,
    userId,
    purpose: "magic-login",
    used: false,
    expiresAt: new Date(Date.now() + MAGIC_EXP_MIN * 60 * 1000)
  });

  return token;
}

/**
 * Attempts to mark a jti as consumed. Returns the token doc if success, otherwise null.
 * Note: jti is the raw jti string from the decoded JWT (not the full token).
 */
export async function consumeMagicTokenByJti(jti) {
  const tokens = await TokenModel.find({ used: false, purpose: "magic-login" });
  for (const t of tokens) {
    const ok = await bcrypt.compare(jti, t.jtiHash);
    if (ok) {
      // check expiry
      if (t.expiresAt && t.expiresAt < new Date()) {
        return null;
      }
      t.used = true;
      await t.save();
      return t;
    }
  }
  return null;
}

export function verifyMagicJwt(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}
