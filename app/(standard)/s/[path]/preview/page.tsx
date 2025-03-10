import StorePage from "../page";


export default async function PreveiwStorePage(props: { params:  Promise<{
  params: { path: string }
}>}) {
  const params = await props.params
  return <StorePage params={params.params} preview={true} />;
}
