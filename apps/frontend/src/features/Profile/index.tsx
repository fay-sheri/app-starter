import { Button, Avatar, Tabs, Tag, Empty } from "antd";
import { useState } from "react";
import { EditModal } from "./EditModal";

// 先用假数据把结构立起来
const me = {
  name: "小林",
  handle: "@lin",
  role: "前端开发者 · 广州",
  bio: "做网页小游戏和工具型项目，喜欢把底层原理先啃一遍再写代码。",
  avatar: "",
  location: "广州",
  links: { github: "https://github.com/", site: "https://example.com" },
  skills: ["React", "TypeScript", "Vite", "Node.js"],
  stats: { works: 12, likes: 86, following: 9 },
};

export function Profile() {
  const tabItems = [
    {
      key: "works",
      label: "我的作品",
      children: (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <Empty description="还没有作品" />
        </div>
      ),
    },
    {
      key: "likes",
      label: "收藏",
      children: <Empty description="暂无收藏" />,
    },
    {
      key: "about",
      label: "关于",
      children: (
        <div className="max-w-2xl space-y-3 text-sm text-gray-600">
          <p>{me.bio}</p>
          <p>所在地：{me.location}</p>
          <div className="flex gap-4 pt-2">
            <a href={me.links.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={me.links.site} target="_blank" rel="noreferrer">
              个人站
            </a>
          </div>
        </div>
      ),
    },
  ];
  const [editModalOpen, setEditModalOpen] = useState(false);
  return (
    <>
      <EditModal
        open={editModalOpen}
        initial={me}
        onClose={() => setEditModalOpen(false)}
        onSubmit={(values) => {
          // 处理提交逻辑
        }}
      />
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* 身份卡 */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-5 rounded-xl border bg-white p-6">
          <Avatar size={88} src={me.avatar || undefined}>
            {me.name.slice(0, 1)}
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{me.name}</h1>
                <p className="text-sm text-gray-400">
                  {me.handle} · {me.role}
                </p>
              </div>
              <Button type="primary" onClick={() => setEditModalOpen(true)}>
                编辑资料
              </Button>
            </div>

            <p className="mt-3 text-sm text-gray-600">{me.bio}</p>

            {/* 统计 */}
            <div className="mt-4 flex gap-6 text-sm">
              <span>
                <b className="text-gray-900">{me.stats.works}</b> 作品
              </span>
              <span>
                <b className="text-gray-900">{me.stats.likes}</b> 获赞
              </span>
              <span>
                <b className="text-gray-900">{me.stats.following}</b> 关注
              </span>
            </div>

            {/* 技能标签 */}
            <div className="mt-4 flex flex-wrap gap-2">
              {me.skills.map((s) => (
                <Tag key={s} color="blue">
                  {s}
                </Tag>
              ))}
            </div>
          </div>
        </div>

        {/* 内容区 */}
        <div className="mt-6">
          <Tabs items={tabItems} />
        </div>
      </div>
    </>
  );
}

// 1. 容器：min-h-screen bg-xxx → mx-auto max-w-xxx px-4 py-8
// 2. 卡片：bg-white rounded-2xl border/shadow p-6
// 3. 横排：flex items-start gap-5
// 4. 主区：flex-1 min-w-0（防溢出）
// 5. 文字：gray-900标题 / gray-600正文 / gray-400附属
// 6. 间距：组内紧(mt-2)、组间松(mt-4/mt-6)
// 7. 响应：先手机竖排，sm: 起横排
// 8. 交互：hover 只配 shadow/translate，transition 必带
