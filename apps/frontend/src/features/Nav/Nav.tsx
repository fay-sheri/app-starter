import { Menu } from "antd";
import { menuitems, getSelectedKey } from "./menuItems";

import { useNavigate, useLocation } from "react-router-dom";

export function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = getSelectedKey(location.pathname);

//   console.log('selectedKey:', selectedKey);

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
