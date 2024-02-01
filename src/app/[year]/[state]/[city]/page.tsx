import Calculator from "@/components/Calculator";
import Wrapper from "@/components/Wrapper";
import {
  INCOME_TAX_CALCULATOR,
  INCOME_TAX_CALCULATOR_SHORT_TITLE,
} from "@/constants/pages";
import { getCityPageData } from "@/utils/get-page-data";
import { CityPageParams, CityPageProps } from "@/types/page";
import { getCityPageParams } from "@/utils/get-page-params";

export default async function City({ params }: CityPageProps) {
  const data = await getCityPageData(params);
  return (
    <Wrapper
      title={INCOME_TAX_CALCULATOR.name}
      shortTitle={INCOME_TAX_CALCULATOR_SHORT_TITLE}
    >
      <Calculator {...data} />
    </Wrapper>
  );
}

export async function generateStaticParams(): Promise<CityPageParams[]> {
  return getCityPageParams();
}
