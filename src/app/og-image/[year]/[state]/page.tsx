import type { StatePageParams, StatePageProps } from "@/types/page";
import { getStatePageData } from "@/utils/get-page-data";
import { OGComponent } from "@/components/OpenGraphContainer";
import { getStatePageParams } from "@/utils/get-page-params";

export default async function StateOG({ params }: StatePageProps) {
  // Only generate OG images in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const data = await getStatePageData(params);

  return <OGComponent {...data} />;
}

export async function generateStaticParams(): Promise<StatePageParams[]> {
  return getStatePageParams();
}
