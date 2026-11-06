import "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    skipAuthRefresh?: boolean; //和apps\frontend\src\api\auth\withAuthRetry.ts功能有重复，一般不需要，调试可以为了方便使用
  }
  interface InternalAxiosRequestConfig {
    skipAuthRefresh?: boolean;
    __retried?: boolean;
  }
}
