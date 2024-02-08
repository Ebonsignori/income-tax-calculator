import { getLandingPageData } from "@/utils/get-page-data";
import { OGComponent } from "@/components/OpenGraphContainer";

export default async function LandingOG() {
  // Only generate OG images in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const data = await getLandingPageData();

  return <OGComponent {...data} />;
}
