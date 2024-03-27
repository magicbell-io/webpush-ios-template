import MagicBell from "magicbell";
import type { NextApiRequest, NextApiResponse } from "next";

interface WelcomeRequest extends NextApiRequest {
  body: {
    userId: string;
  };
}

type ResponseData = {
  status: string;
};

const magicbell = new MagicBell({
  apiKey: process.env.NEXT_PUBLIC_MAGICBELL_API_KEY,
  apiSecret: process.env.MAGICBELL_API_SECRET,
});

export default async function handler(
  req: WelcomeRequest,
  res: NextApiResponse<ResponseData>
) {
  await magicbell.notifications.create({
    title: "Ding, dong 🔔 Hello from MagicBell!",
    content: "Lets add web push notifications to your app?",
    action_url: "https://www.magicbell.com?utm_source=webpushtest",
    recipients: [{ external_id: req.body.userId }],
    category: "default",
  });
  res.status(200).json({ status: "success" });
}
