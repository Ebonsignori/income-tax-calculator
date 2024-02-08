import { getCityPageData } from "@/utils/get-page-data";
import type { CityPageParams, CityPageProps } from "@/types/page";
import { OGComponent } from "@/components/OpenGraphContainer";
import { getCityPageParams } from "@/utils/get-page-params";

export default async function CityOG({ params }: CityPageProps) {
  // Only generate OG images in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const data = await getCityPageData(params);

  return <OGComponent {...data} />;
}

export async function generateStaticParams(): Promise<CityPageParams[]> {
  return getCityPageParams();
}
