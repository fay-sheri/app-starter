import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client.ts";

import { RouterProvider } from "react-router-dom";
import { router } from "./lib/router.tsx";

import { ConfigProvider, App as AntApp, theme } from "antd";
import type { ThemeConfig } from "antd";

const myTheme: ThemeConfig = {
  token: {
    // 这里放“种子级”全局变量
    // colorPrimary: '#165DFF',
    // borderRadius: 6,
    // fontSize: 14,
  },
  components: {
    Menu: {
      // 只改 Menu 的变量
      // itemSelectedBg: '',
      // horizontalItemSelectedBg: '',
      activeBarHeight: 2,
      // itemBg: '#1677ff'
    },
  },
  algorithm: theme.defaultAlgorithm, // 或 darkAlgorithm / compactAlgorithm
};

import zhCN from "antd/locale/zh_CN";

import { StyleProvider } from "@ant-design/cssinjs";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* css 注入ant层 */}
      <StyleProvider layer>
        {/* 语言和自定义主题 */}
        <ConfigProvider locale={zhCN} theme={myTheme}>
          {/* 避免弹窗类样式错误 */}
          <AntApp>
            <RouterProvider router={router} />
          </AntApp>
        </ConfigProvider>
      </StyleProvider>
    </QueryClientProvider>
  </StrictMode>,
);
