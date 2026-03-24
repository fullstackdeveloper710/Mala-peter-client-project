import { RiveScrollSync } from "@/components/RiveScrollSync";
import { getColumns } from "@/lib/microcms";

export default async function Home() {
  const columns = await getColumns(3);
  return <RiveScrollSync debug columns={columns} />;
}
