import Calculator from "@/components/Calculator";
import Wrapper from "@/components/Wrapper";
import {
  INCOME_TAX_CALCULATOR,
  INCOME_TAX_CALCULATOR_SHORT_TITLE,
} from "@/constants/pages";
import { getLandingPageData } from "@/utils/get-page-data";

export default async function Landing() {
  const data = await getLandingPageData();
  return (
    <Wrapper
      title={INCOME_TAX_CALCULATOR.name}
      shortTitle={INCOME_TAX_CALCULATOR_SHORT_TITLE}
    >
      <Calculator {...data} />
    </Wrapper>
  );
}
