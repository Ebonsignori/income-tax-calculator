import Calculator from "@/components/Calculator";
import Wrapper from "@/components/Wrapper";
import {
  INCOME_TAX_CALCULATOR,
  INCOME_TAX_CALCULATOR_SHORT_TITLE,
} from "@/constants/pages";
import { YearPageParams, YearPageProps } from "@/types/page";
import { getYearPageData } from "@/utils/get-page-data";
import { getYearPageParams } from "@/utils/get-page-params";

export default async function Year({ params }: YearPageProps) {
  const data = await getYearPageData(params);
  return (
    <Wrapper
      title={INCOME_TAX_CALCULATOR.name}
      shortTitle={INCOME_TAX_CALCULATOR_SHORT_TITLE}
    >
      <Calculator {...data} />
    </Wrapper>
  );
}

export async function generateStaticParams(): Promise<YearPageParams[]> {
  return getYearPageParams();
}
