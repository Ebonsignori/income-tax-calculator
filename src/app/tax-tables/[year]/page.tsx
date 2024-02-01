import TaxTables from "@/components/TaxTables";
import Wrapper from "@/components/Wrapper";
import { TAX_TABLES } from "@/constants/pages";
import { YearPageProps } from "@/types/page";
import { getYearPageData } from "@/utils/get-page-data";
import { getYearPageParams } from "@/utils/get-page-params";

export default async function TaxTableYear({ params }: YearPageProps) {
  const data = await getYearPageData(params);
  return (
    <Wrapper title={TAX_TABLES.name}>
      <TaxTables {...data} />
    </Wrapper>
  );
}

export async function generateStaticParams() {
  return getYearPageParams();
}
