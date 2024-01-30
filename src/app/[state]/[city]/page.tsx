import Home from "../../page";

export default function StateWithCity(params: {
  params: { state: string; city: string };
}) {
  const { state, city } = params.params;
  return <Home defaultUSAState={state} defaultUSACity={city} />;
}

export async function generateStaticParams() {
  return [
    { state: "oregon", city: "portland" },
  ];
}
