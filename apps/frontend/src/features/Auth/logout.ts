import { logoutApi } from "../../api/auth/auth";
import { useAuthStore } from "../../store/authStore";
import { queryClient } from "../../lib/query-client";
import { router } from "../../lib/router";

export async function logout() {
  try {
    await logoutApi();
  } finally {
    useAuthStore.getState().logout();
    queryClient.clear();
    router.navigate("/auth", { replace: true });
  }
}
