import React, { useEffect, useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import Home from './home/Home'
import UserList from './user-manage/UserList'
import RightList from './right-manage/RightList'
import RoleList from './right-manage/RoleList'
import Nopermission from './Nopermission/Nopermission'
import NewsAdd from './news-manage/NewsAdd'
import NewsCategory from './news-manage/NewsCategory'
import NewsDraft from './news-manage/NewsDraft'
import NewsPreview from './news-manage/NewsPreview'
import NewsUpdate from './news-manage/NewsUpdate'
import Sunset from './publish-manage/Sunset'
import Published from './publish-manage/Published'
import Unpublished from './publish-manage/Unpublished'
import Audit from './audit-manage/Audit'
import AuditList from './audit-manage/AuditList'
// css
import './NewsSandBox.css'
// antd
import { Layout, Spin } from 'antd';
import axios from 'axios'
import { connect } from 'react-redux'
const { Content } = Layout;

const LocalRouterMap = {
    '/home': Home,
    "/user-manage/list": UserList,
    // "/user-manage":
    "/right-manage/right/list": RightList,
    "/right-manage/role/list": RoleList,
    // "/right-manage":
    "/audit-manage/list": AuditList,
    "/audit-manage/audit": Audit,
    // '/audit-manage':
    "/publish-manage/sunset": Sunset,
    "/publish-manage/published": Published,
    "/publish-manage/unpublished": Unpublished,
    // '/publish-manage':
    '/news-manage/draft': NewsDraft,
    "/news-manage/add": NewsAdd,
    "/news-manage/category": NewsCategory,
    "/news-manage/preview/:id": NewsPreview,
    "/news-manage/update/:id": NewsUpdate,
    // '/news-manage':
}
//实际要根据后端动态创建路由
function NewsSandBox(props) {
    NProgress.start()//每次页面更新刚开始就出现进度条
    useEffect(() => {//渲染结束就取消掉
        NProgress.done()
    })
    //对于后端拿来的数据是有子级的，那么就需要一个扁平化处理，json-server可以直接在后端合并扁平化拿回来，因为是两个平级的数据，children和rights，这就要发两个请求，可以用两个promise，用promise.all等两个数据都取回来了就合并数组
    const [backRouteList, setBackRouteList] = useState([])
    useEffect(() => {
        Promise.all([
            axios.get('/rights'),
            axios.get('/children')
        ]).then(res => {
            // console.log(res);
            setBackRouteList([...res[0].data, ...res[1].data])
        })
    }, [])
    const checkRouter = (item) => {
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)//判断是否有这个路由，还判断是否打开这个路由的状态，
    }
    const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
    const checkUserPermission = (item) => {
        //判断当前登录用户所包含的权限,如果关掉了某个用户的某个权限，必须重新登陆一下，清除掉token【代码缺陷，因为是从token中获取的来】
        return rights.includes(item.key)
    }
    return (
        <Layout>
            <SideMenu></SideMenu>
            <Layout className="site-layout">
                <TopHeader></TopHeader>
                <Content className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow: 'auto'
                    }}>
                    {
                        <Spin size='large' spinning={props.isSpinning}>
                            <Switch>
                                {

                                    //其中里面有一级路径，模糊匹配被覆盖了,exact来解决
                                    backRouteList.map((item) => {
                                        if (checkRouter(item) && checkUserPermission(item)) {
                                            return <Route key={item.key} path={item.key} component={LocalRouterMap[item.key]} exact></Route>
                                        } else {
                                            return null
                                        }
                                    })

                                }
                                {/* 主页 */}
                                <Redirect from="/" to="/home" exact />
                                {/* 用户列表 */}
                                <Redirect from="/user-manage" to="/user-manage/list" exact />
                                {/* 权限管理 */}
                                <Redirect from="/right-manage" to="/right-manage/role/list" exact />
                                {/* promise没拿回来之前会提前渲染一次，所以要判断一下 */}
                                {
                                    backRouteList.length > 0 && <Route path="*" component={Nopermission}></Route>
                                }
                            </Switch>
                        </Spin>
                    }
                </Content>
            </Layout>
        </Layout>
    )
}
const mapStateToProps = (props) => {
    const { LoadingReducer: { isSpinning } } = props
    return {
        isSpinning
    }
}
export default connect(mapStateToProps)(NewsSandBox)
//自己手动写的路由,并没有判断到permission这个字段是否为1，也就是是否允许被访问到
// export default function NewsSandBox() {
//     const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
//     // console.log('/' + window.location.hash.split('/')[1]);
//     const ispermission = rights.includes('/' + window.location.hash.split('/')[1])
//     return (
//         <Layout>
//             <SideMenu></SideMenu>
//             <Layout className="site-layout">
//                 <TopHeader></TopHeader>
//                 <Content className="site-layout-background"
//                     style={{
//                         margin: '24px 16px',
//                         padding: 24,
//                         minHeight: 280,
//                         overflow: 'auto'
//                     }}>
//                     {
//                         //条件渲染，如果此用户下输入的路由不被允许，则渲染Nopermission,否则使用Switch渲染对应的允许的路由
//                         !ispermission ? (<Nopermission></Nopermission>) : (
//                             <Switch>
//                                 {/* 主页 */}
//                                 <Route path="/home" component={Home}></Route>
//                                 <Redirect from="/" to="/home" exact />
//                                 {/* 用户列表 */}
//                                 <Route path="/user-manage/list" component={UserList}></Route>
//                                 <Redirect from="/user-manage" to="/user-manage/list" exact />
//                                 {/* 权限管理 */}
//                                 <Route path="/right-manage/right/list" component={RightList}></Route>
//                                 <Route path="/right-manage/role/list" component={RoleList}></Route>
//                                 <Redirect from="/right-manage" to="/right-manage/role/list" exact />
//                                 {/* 审核管理 */}
//                                 <Route path={"/audit-manage/list"}></Route>
//                                 <Route path={"/audit-manage/audit"}></Route>
//                                 <Redirect from={'/audit-manage'} to={"/audit-manage/list"} exact></Redirect>
//                                 {/* 发布管理 */}
//                                 <Route path={"/publish-manage/sunset"}></Route>
//                                 <Route path={"/publish-manage/published"}></Route>
//                                 <Route path={"/publish-manage/unpublished"}></Route>
//                                 <Redirect from={'/publish-manage'} to={"/publish-manage/published"} exact></Redirect>

//                                 {/* 新闻管理 */}
//                                 <Route path={'/news-manage/draft'}></Route>
//                                 <Route path={"/news-manage/add"}></Route>
//                                 <Route path={"/news-manage/category"}></Route>
//                                 <Redirect from={'/news-manage'} to={"/news-manage/category"} exact></Redirect>
//                                 {/* 其他 */}
//                                 <Route path="*" component={Nopermission}></Route>
//                             </Switch>)
//                     }
//                 </Content>
//             </Layout>
//         </Layout>
//     )
// }
