import { BasicLayout } from "../layouts/BasicLayout";
import { Nav } from "../features/Nav";
import { CurosorPage } from "../features/CursorPage/index"

export function Home() {
  return <BasicLayout header={<Nav/>} content={<CurosorPage/>} />;
}
