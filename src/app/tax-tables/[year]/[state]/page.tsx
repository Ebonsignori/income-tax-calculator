import TaxTables from "@/components/TaxTables";
import Wrapper from "@/components/Wrapper";
import { TAX_TABLES } from "@/constants/pages";
import { StatePageProps } from "@/types/page";
import { getStatePageData } from "@/utils/get-page-data";
import { getStatePageParams } from "@/utils/get-page-params";

export default async function TaxTableState({ params }: StatePageProps) {
  const data = await getStatePageData(params);
  return (
    <Wrapper title={TAX_TABLES.name}>
      <TaxTables {...data} />
    </Wrapper>
  );
}

export async function generateStaticParams() {
  return getStatePageParams();
}
