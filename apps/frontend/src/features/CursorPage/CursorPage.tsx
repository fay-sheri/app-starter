import { Button, Input, Empty, Spin } from "antd";
import { useEffect, useRef } from "react";
import { useWorks } from "./useWorks";

export function CurosorPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useWorks();
  const works = data?.pages.flatMap((n) => n.list) ?? [];
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !(!!hasNextPage && !isFetchingNextPage)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }, // 提前 200px 预加载
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* 头部文案 */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">发现优秀作品</h1>
        <p className="mt-2 text-gray-500">展示创意，连接同好</p>
      </div>

      {/* 搜索 + 筛选 */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Input.Search placeholder="搜作品 / 作者" className="w-72" />
        <Button type="primary">最新</Button>
        <Button>热门</Button>
        <Button>关注</Button>
      </div>
      {isLoading && <div className="py-20 text-center"><Spin description={<p>"加载中..."</p>} /></div>}
      {isError && <div className="py-20 text-center text-red-500">出错：{(error as Error).message}</div>}
      {/* 网格 */}
      {works.length === 0 ? (
        <Empty className="py-20" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {works.map((w) => (
              <div
                key={w.id}
                className="cursor-pointer overflow-hidden rounded-lg border hover:shadow-md transition"
              >
                <div className="aspect-video bg-gray-100" />
                <div className="p-3">
                  <div className="truncate font-medium">{w.title}</div>
                  <div className="mt-1 text-sm text-gray-400">{w.author}</div>
                </div>
              </div>
            ))}
          </div>
          {/* 底部状态区 */}
          <div className="py-6 text-center">
            {isFetchingNextPage && <span className="text-gray-400">加载中...</span>}
            {!hasNextPage && works.length > 0 && (
              <span className="text-gray-300">没有更多了</span>
            )}
          </div>
          {/* 滚到这里自动加载 */}
          <div ref={sentinelRef} className="h-1" />
        </>
      )}
    </div>
  );
}
