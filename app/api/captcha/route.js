import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;

  const answer = a + b;

  // token sécurisé
  const token = crypto.randomUUID();

  // ⚠️ en vrai projet → Redis / DB / session
  global.captchas = global.captchas || {};
  global.captchas[token] = answer;

  // expire après 2 min
  setTimeout(() => {
    delete global.captchas[token];
  }, 2 * 60 * 1000);

  return NextResponse.json({
    question: `Combien font ${a} + ${b} ?`,
    token,
  });
}
