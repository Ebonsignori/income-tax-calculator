import type { YearPageParams, YearPageProps } from "@/types/page";
import { getYearPageData } from "@/utils/get-page-data";
import { OGComponent } from "@/components/OpenGraphContainer";
import { getYearPageParams } from "@/utils/get-page-params";

export default async function YearOG({ params }: YearPageProps) {
  // Only generate OG images in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const data = await getYearPageData(params);

  return <OGComponent {...data} />;
}

export async function generateStaticParams(): Promise<YearPageParams[]> {
  return getYearPageParams();
}
