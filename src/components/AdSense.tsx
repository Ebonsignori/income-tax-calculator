import { useEffect } from "react";

const AdSense = ({ adSlot }: { adSlot: string }) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const windowWithAds = window as any;
      (windowWithAds.adsbygoogle = windowWithAds.adsbygoogle || []).push({});
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
      data-ad-slot={adSlot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdSense;
