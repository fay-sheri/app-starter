import { useMemo } from "react"

import { Menu } from "antd";
import { buildMenuItems, getSelectedKey } from "./menuItems";

import { useNavigate, useLocation } from "react-router-dom";

import { useAuthStore } from "../../store/authStore"

export function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = getSelectedKey(location.pathname);

  const isLogin = useAuthStore(s => s.isAuthenticated)
  const menuitems = useMemo(
    () => buildMenuItems(isLogin),
    [isLogin]
  );


  return (
    <Menu 
      mode="horizontal"
      items={menuitems}
      selectedKeys={selectedKey ? [selectedKey] : []}
      onClick={({ key }) => {
        navigate(key);
      }}
    ></Menu>
  );
}
