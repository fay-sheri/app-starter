import { createBrowserRouter } from "react-router-dom";

import { NotFoundPage } from "../features/NotFoundPage";
import { ProtectedRoute } from "../features/Auth/ProtectedRoute";

import { Home } from "../pages/Home";
import { User } from "../pages/User";
import { Auth } from "../pages/Auth";

export const router = createBrowserRouter([
  //修改这个后记得修改菜单配置"apps/frontend/src/features/Nav/menuItems.tsx"
  { path: "/", element: <Home></Home> },
  {
    path: "/auth",
    element: <Auth></Auth>,
  },
  {
    path: "/menu",
    element: <ProtectedRoute></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: "user",
        element: <User></User>,
      },
      // {
      //   path: "users/:id",
      //   element: <></>,
      // },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
