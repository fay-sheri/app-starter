import { BasicLayout } from "../layouts/BasicLayout";
import { Nav } from "../features/Nav/index";

export function Home() {
  const Header = (
    <div>
      <Nav></Nav>
    </div>
  );
  return <BasicLayout header={Header}></BasicLayout>;
}
