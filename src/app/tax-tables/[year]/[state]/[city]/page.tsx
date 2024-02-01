import TaxTables from "@/components/TaxTables";
import Wrapper from "@/components/Wrapper";
import { TAX_TABLES } from "@/constants/pages";
import { CityPageProps } from "@/types/page";
import { getCityPageData } from "@/utils/get-page-data";
import { getCityPageParams } from "@/utils/get-page-params";

export default async function TaxTableCity({ params }: CityPageProps) {
  const data = await getCityPageData(params);
  return (
    <Wrapper title={TAX_TABLES.name}>
      <TaxTables {...data} />
    </Wrapper>
  );
}

export async function generateStaticParams() {
  return getCityPageParams();
}
