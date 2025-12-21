import CityTaxes from "@/components/CityTaxes";
import Wrapper from "@/components/Wrapper";
import { CITY_TAXES } from "@/constants/pages";
import type { YearPageParams, YearPageProps } from "@/types/page";
import { defaultMetadata, getPageSpecificMetadata } from "@/utils/get-metadata";
import { getCityTaxListData } from "@/utils/get-page-data";
import { getYearPageParams } from "@/utils/get-page-params";

export default async function CityTaxesYear({ params }: YearPageProps) {
  const data = await getCityTaxListData(params.year);
  return (
    <Wrapper title={CITY_TAXES.name}>
      <CityTaxes {...data} />
    </Wrapper>
  );
}

export async function generateStaticParams(): Promise<YearPageParams[]> {
  return getYearPageParams();
}

export async function generateMetadata({ params }: YearPageProps) {
  return {
    title: `${params.year} ${CITY_TAXES.name}`,
    ...defaultMetadata,
    ...getPageSpecificMetadata(CITY_TAXES.name, params.year),
  };
}
