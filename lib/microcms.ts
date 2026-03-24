export type ColumnItem = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  thumbnail: {
    url: string;
    height: number;
    width: number;
  };
  title: string;
  content: string;
};

type ColumnResponse = {
  contents: ColumnItem[];
  totalCount: number;
  offset: number;
  limit: number;
};

const API_KEY = process.env.MICROCMS_API_KEY ?? "";
const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN ?? "peterpan";

export async function getColumns(limit = 3): Promise<ColumnItem[]> {
  const res = await fetch(
    `https://${SERVICE_DOMAIN}.microcms.io/api/v1/column?limit=${limit}`,
    {
      headers: { "X-MICROCMS-API-KEY": API_KEY },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    console.error("[microcms] Failed to fetch columns:", res.status);
    return [];
  }

  const data: ColumnResponse = await res.json();
  console.log("[microcms] Success getting columns.");
  return data.contents;
}
