import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../lib/http";

interface Work {
  id: string;
  title: string;
  cover: string;
  author: string;
}

interface WorksPage {
  list: Work[];
  nextCursor: string | null;
}
export type WorksResponse = WorksPage;

async function fetchWorks(cursor?: string): Promise<WorksPage> {
  const { data } = await api.get<WorksPage>("api/works", {
    params: {
      limit: 20,
      ...(cursor ? { cursor } : {}),
    },
  });
  return data;
}

export function useWorks() {
  return useInfiniteQuery({
    queryKey: ["works"],
    queryFn: ({ pageParam }) => fetchWorks(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

