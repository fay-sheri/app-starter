import type { MenuProps } from "antd";
import { UserOutlined, HomeFilled, IdcardOutlined, ProfileOutlined } from "@ant-design/icons";

type MenuItem = Required<MenuProps>["items"][number];


export function buildMenuItems(isLogin: boolean): MenuItem[] {
  const items: MenuItem[] = [
    //修改这个后记得修改下面的匹配表
    {
      label: "HOME",
      key: "/",
      icon: <HomeFilled />,
    },
    {
      label: "User",
      key: "/menu/user",
      icon: <UserOutlined />,
    },
  ];

  if (isLogin) {
    items.push({
      label: "个人资料",
      key: "/menu/profile",
      icon: <ProfileOutlined />,
    });
  } else {
    items.push({
      label: "Login",
      key: "/auth",
      icon: <IdcardOutlined />,
    });
  }

  return items;
}

import { matchPath } from "react-router-dom";

export const menuKeyPatterns: { pattern: string; key: string }[] = [
  { pattern: "/auth", key: "/auth" },
  { pattern: "/", key: "/" },
  { pattern: "/menu/user", key: "/menu/user" },
  { pattern: "/menu", key: "/" },
  { pattern: "/user/list", key: "/user/list" },
  { pattern: "/user/:id", key: "/user/list" },
  { pattern: "/user/:id/edit", key: "/user/list" },
  { pattern: "/user/role", key: "/user/role" },
  { pattern: "/setting", key: "/setting" },
];
export function getSelectedKey(pathname: string): string | null {
  for (const { pattern, key } of menuKeyPatterns) {
    const m = matchPath({ path: pattern, end: true }, pathname);
    if (m) return key;
  }
  return null;
}
