import Calculator from "@/components/Calculator";
import Wrapper from "@/components/Wrapper";
import {
  INCOME_TAX_CALCULATOR,
  INCOME_TAX_CALCULATOR_SHORT_TITLE,
} from "@/constants/pages";
import { StatePageParams, StatePageProps } from "@/types/page";
import { defaultMetadata, getPageSpecificMetadata } from "@/utils/get-metadata";
import { getStatePageData } from "@/utils/get-page-data";
import { getStatePageParams } from "@/utils/get-page-params";
import { snakeToTitleCase } from "@/utils/string-utils";

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

export async function generateMetadata({ params }: StatePageProps) {
  return {
    title: `${params.year} ${snakeToTitleCase(params.state)} ${INCOME_TAX_CALCULATOR.name}`,
    ...defaultMetadata,
    ...getPageSpecificMetadata(
      INCOME_TAX_CALCULATOR.name,
      params.year,
      params.state,
    ),
  };
}
