import { Button, Input, Empty } from "antd";
import { BasicLayout } from "../layouts/BasicLayout";
import { Nav } from "../features/Nav";

const mockWorks = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: `作品 ${i + 1}ssssssssssssssssssssssssssssssssssssssdddddddd`,
  cover: "",
  author: "测试用户",
}));

export function Home() {
  const header = (
    <div className="px-6">
      <Nav />
    </div>
  );

  const content = (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* 头部文案 */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">发现优秀作品</h1>
        <p className="mt-2 text-gray-500">展示创意，连接同好</p>
      </div>

      {/* 搜索 + 筛选：antd 出控件，Tailwind 排版 */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Input.Search placeholder="搜作品 / 作者" className="w-72" />
        <Button type="primary">最新</Button>
        <Button>热门</Button>
        <Button>关注</Button>
      </div>

      {/* 网格：Tailwind 管布局 */}
      {mockWorks.length === 0 ? (
        <Empty className="py-20" />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {mockWorks.map((w) => (
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
      )}
    </div>
  );

  return <BasicLayout header={header} content={content} />;
}
