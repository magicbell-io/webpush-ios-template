import { clientSettings, useConfig } from "@magicbell/react-headless";
import { prefetchConfig, registerServiceWorker } from "@magicbell/webpush";
import React, { useEffect, useMemo } from "react";

import Button from "@/components/button";
import { State } from "@/pages";
import subscriptionManager from "@/services/subscriptionManager";

const host =
  process.env.NEXT_PUBLIC_MAGICBELL_API_BASE_URL || "https://api.magicbell.com";

export default function Subscriber({
  state,
  setState,
}: {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
}) {
  const config = useConfig();

  const subscribeOptions = useMemo(() => {
    try {
      const url = new URL(config.channels?.webPush.config.subscribeUrl || "");
      return {
        token: url.searchParams.get("access_token") || "",
        project: url.searchParams.get("project") || "",
        host,
      };
    } catch (e) {
      return { token: "", project: "", host };
    }
  }, [config]);

  useEffect(() => {
    if (!subscribeOptions.token) {
      return;
    }
    registerServiceWorker();
    prefetchConfig(subscribeOptions);
  }, [subscribeOptions]);

  const handleSubscribe = async () => {
    try {
      setState({ status: "busy" });
      await subscriptionManager.subscribe(
        clientSettings.getState().userExternalId as string, // TODO: fix typing here
        subscribeOptions
      );
      setState({ status: "success" });
    } catch (error: any) {
      setState({ status: "error", error: error.message });
    }
  };

  const isLoading = !subscribeOptions.token || state.status === "busy";

  if (isLoading) {
    return <Button text="Loading" classname="bg-gray-500" disabled={true} />;
  }

  if (state.status === "error") {
    return <Button text="Error" classname="bg-red-400" disabled={true} />;
  }

  return (
    <>
      <Button
        onClick={handleSubscribe}
        text="Subscribe"
        classname="bg-primary"
        disabled={false}
      />
      <p className="text-xs mt-6 mb-16">
        * Once you subscribe we will send you one automatic test-notification.
        You can unsubscribe at any time.
      </p>
    </>
  );
}
