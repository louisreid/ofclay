import { Resend } from "resend";

const TO = "info@ofclay.co";
const FROM = "of clay <enquiries@ofclay.co>";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error("[ofclay] RESEND_API_KEY missing");
    return res
      .status(503)
      .json({ ok: false, error: "Email is not configured yet." });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const honey = String(body.honey ?? "").trim();

  if (honey) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: "Please fill in all fields." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: "Please enter a valid email." });
  }

  if (name.length > 200 || email.length > 320 || message.length > 5000) {
    return res.status(400).json({ ok: false, error: "One of the fields is too long." });
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send(
    {
      from: FROM,
      to: [TO],
      replyTo: email,
      subject: `Enquiry from ${name}`,
      text: [`Name: ${name}`, `Email: ${email}`, "", message].join("\n"),
    },
    { idempotencyKey: `enquiry/${email}/${Date.now()}` }
  );

  if (error) {
    console.error("[ofclay] resend failed", error.message, error);
    return res
      .status(502)
      .json({ ok: false, error: "Could not send just now. Please try again." });
  }

  return res.status(200).json({ ok: true, id: data?.id ?? null });
}
