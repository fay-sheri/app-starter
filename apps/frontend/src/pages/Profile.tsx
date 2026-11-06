import { BasicLayout } from "../layouts/BasicLayout";
import { Nav } from "../features/Nav/index";
import { Profile as P } from "../features/Profile/index";

export function Profile() {
  return <BasicLayout header={<Nav />} content={<P />}></BasicLayout>;
}
