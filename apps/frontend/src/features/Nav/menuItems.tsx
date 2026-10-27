import type { MenuProps } from "antd";
import { UserOutlined, HomeFilled, IdcardOutlined } from "@ant-design/icons";

type MenuItem = Required<MenuProps>["items"][number];

export const menuitems: MenuItem[] = [
  //修改这个后记得修改下面的匹配表
  {
    label: "HOME",
    key: "/",
    icon: <HomeFilled />,
  },
  {
    label: "User",
    key: "/user",
    icon: <UserOutlined />,
  },
  {
    label: "Login",
    key: "/auth",
    icon: <IdcardOutlined />,
  },
];

import { matchPath } from "react-router-dom";

export const menuKeyPatterns: { pattern: string; key: string }[] = [
  { pattern: "/auth", key: "/auth" },
  { pattern: "/", key: "/" },
  { pattern: "/user", key: "/user" },
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
