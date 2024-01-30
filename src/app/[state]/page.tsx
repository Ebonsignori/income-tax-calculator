import TaxTables from "@/components/TaxTables";
import Home from "../page";

export default function State({ params }: { params: { state: string } }) {
  const { state } = params;
  return <Home defaultUSAState={state} />;
}

export async function generateStaticParams() {
  return [
    { state: "oregon" },
    { state: "washington" },
  ];
}
