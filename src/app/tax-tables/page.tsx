import TaxTables from "@/components/TaxTables";
import Wrapper from "@/components/Wrapper";
import { TAX_TABLES } from "@/constants/pages";
import { getLandingPageData } from "@/utils/get-page-data";

export default async function TaxTableLanding() {
  const data = await getLandingPageData();
  return (
    <Wrapper title={TAX_TABLES.name}>
      <TaxTables {...data} />
    </Wrapper>
  );
}
