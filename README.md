# app-starter 项目结构说明

## 整体概述

`app-starter` 是一个典型的 **Monorepo（单仓库多项目）** 项目结构，通常使用 pnpm workspace、Turborepo、Nx 等工具管理。

它是一个**项目脚手架 / 启动模板**，把前端、后端、共享代码放在同一个 Git 仓库里统一管理，而不是拆成多个独立仓库。

---

## 目录结构

```text
app-starter/
├── apps/                    # 可独立运行的应用
│   ├── frontend/            # 前端应用（如 React / Vue / Next.js）
│   └── backend/             # 后端应用（如 Node / Express / NestJS）
├── packages/                # 可复用的内部包（不直接运行）
│   └── shared/              # 前后端共享的类型定义、工具函数
├── docs/                    # 文档，如 API 接口文档
├── README.md                # 项目说明
└── .gitignore               # Git 忽略规则
