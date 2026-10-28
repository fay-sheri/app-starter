import { BasicLayout } from '../layouts/BasicLayout'
import { Nav } from '../features/Nav/index'

export function User(){
    return (
        <BasicLayout header={<Nav />}></BasicLayout>
    )
}