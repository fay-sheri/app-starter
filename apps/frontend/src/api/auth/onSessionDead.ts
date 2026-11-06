import { queryClient } from "../../lib/query-client";
import { router } from "../../lib/router";
import { useAuthStore } from "../../store/authStore";

let deading = false;

export function onSessionDead() {
  if (deading) return;
  deading = true;
  useAuthStore.getState().logout();
  queryClient.clear(); //清除所有缓存
  router.navigate("/auth", { replace: true });
}

//记得新会话恢复
export function resetSessionGuard() {
  deading = false;
}
