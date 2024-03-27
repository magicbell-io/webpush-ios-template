import { DeviceInfoProvider } from "@/hooks/useDeviceInfo";
import { SubscriptionManager } from "@/services/subscriptionManager";
import "@/styles/globals.css";
import { MagicBellProvider } from "@magicbell/react-headless";
import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";

const host =
  process.env.NEXT_PUBLIC_MAGICBELL_API_BASE_URL || "https://api.magicbell.com";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <MagicBellProvider
        apiKey={process.env.NEXT_PUBLIC_MAGICBELL_API_KEY}
        userExternalId={SubscriptionManager.getOrSetUserId()}
        serverURL={host}
      >
        <DeviceInfoProvider>
          <Component {...pageProps} />
        </DeviceInfoProvider>
      </MagicBellProvider>
      <Analytics />
    </>
  );
}
