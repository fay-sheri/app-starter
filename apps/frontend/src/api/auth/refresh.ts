import { refreshClient } from "../../lib/refreshClient";
import { createSingleFlight } from "../../utils/locks";
import { onSessionDead } from "./onSessionDead";

import { useAuthStore } from "../../store/authStore";

interface RefreshData {
  accesstoken: string;
}

interface RefreshResponse {
  code: number;
  data: RefreshData;
  message: string;
}

async function doRefresh(): Promise<string> {
  const res = await refreshClient.post<RefreshResponse>("/api/auth/refresh");
  const token = res.data.data.accesstoken;
  useAuthStore.getState().setToken(token); // 设置token
  return token;
}

export const refresh = createSingleFlight(doRefresh, {
  onReject: onSessionDead,
});
