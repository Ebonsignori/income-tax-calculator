import Calculator from "@/components/Calculator";
import Wrapper from "@/components/Wrapper";
import {
  INCOME_TAX_CALCULATOR,
  INCOME_TAX_CALCULATOR_SHORT_TITLE,
} from "@/constants/pages";
import { StatePageParams, StatePageProps } from "@/types/page";
import { getStatePageData } from "@/utils/get-page-data";
import { getStatePageParams } from "@/utils/get-page-params";

export default async function State({ params }: StatePageProps) {
  const data = await getStatePageData(params);
  return (
    <Wrapper
      title={INCOME_TAX_CALCULATOR.name}
      shortTitle={INCOME_TAX_CALCULATOR_SHORT_TITLE}
    >
      <Calculator {...data} />
    </Wrapper>
  );
}

export async function generateStaticParams(): Promise<StatePageParams[]> {
  return getStatePageParams();
}
