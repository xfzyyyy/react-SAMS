import { React, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import './index.css';
import { connect } from 'react-redux';
import { Menu, Layout } from 'antd';

import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
const { Sider } = Layout;

function SideMenu(props) {
    const [menu, setMenu] = useState([]);
    const {
        role: { rights }
    } = JSON.parse(localStorage.getItem('token'));
    useEffect(() => {
        axios.get('/rights?_embed=children').then(res => {
            setMenu(res.data);
        });
    }, []);

    //绑定图标列表
    const iconList = {
        '/home': <AppstoreOutlined />,

        '/user-manage': <MailOutlined />,
        '/user-manage/list': <SettingOutlined />,

        '/right-manage': <SettingOutlined />,
        '/right-manage/role/list': <SettingOutlined />,
        '/right-manage/right/list': <SettingOutlined />,

        '/audit-manage': <AppstoreOutlined />,
        '/audit-manage/list': <AppstoreOutlined />,
        '/audit-manage/audit': <AppstoreOutlined />,

        '/publish-manage': <AppstoreOutlined />,
        '/publish-manage/published': <AppstoreOutlined />,
        '/publish-manage/unpublished': <AppstoreOutlined />,
        '/publish-manage/sunset': <AppstoreOutlined />,

        '/news-manage': <AppstoreOutlined />,
        '/news-manage/draft': <AppstoreOutlined />,
        '/news-manage/add': <AppstoreOutlined />,
        '/news-manage/category': <AppstoreOutlined />
    };
    const checkPagepermisson = item => {
        //pagepermisson页面权限判断
        // setTimeout({
        return item.pagepermisson === 1 && rights.includes(item.key); //判断是否在角色权限里
        // }, 0, item)
    };
    const renderMenu = menu => {
        return menu.map(item => {
            //居然忘记return，调试一小时，最该万斯
            if (checkPagepermisson(item)) {
                //pagepermisson页面权限就渲染
                let label = item.title;
                let key = item.key;
                let icon = iconList[key];
                //验证子元素的权限
                if (item.children?.length > 0) {
                    //es6链式调用
                    let children = renderMenu(item.children);
                    return {
                        label,
                        key,
                        icon,
                        children
                    };
                } else {
                    return {
                        label,
                        key,
                        icon
                    };
                }
            }
            return null; //map要返回一个值防止报警告
        });
    };
    const items = renderMenu(menu);

    const onClick = e => {
        // console.log('click ', e);
        props.history.push(e.key);
    };
    // console.log(props.location.pathname);
    const selectKeys = [props.location.pathname]; //控制选中高亮
    const openKeys = ['/' + props.location.pathname.split('/')[1]]; //控制展开
    // console.log(props);
    return (
        <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
            <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
                <div className='logo'>学生公寓新闻管理系统</div>
                <div style={{ flex: 1, overflow: 'auto' }}>
                    <Menu
                        theme='dark'
                        mode='inline'
                        onClick={onClick}
                        // defaultSelectedKeys={selectKeys}//antd非受控
                        selectedKeys={selectKeys} //antd受控
                        defaultOpenKeys={openKeys}
                        items={items}
                    />
                </div>
            </div>
        </Sider>
    );
}
const mapStateToProps = props => {
    // console.log(props);
    const {
        CollapsedReducer: { isCollapsed }
    } = props;
    return { isCollapsed };
};

export default connect(mapStateToProps)(withRouter(SideMenu));

// 静态渲染
// function getItem(label, key, icon, children, type) {
//     return {
//         key,
//         icon,
//         children,
//         label,
//         type,
//     };
// }
// getItem('首页', '/home', <MailOutlined />,),
// getItem('用户管理', '/user-manage', <AppstoreOutlined />, [
//     getItem('用户列表', '/user-manage/list'),
// ]),
// getItem('权限管理', '/right-manage', <SettingOutlined />, [
//     getItem('角色列表', '/right-manage/role/list'),
//     getItem('权限列表', '/right-manage/right/list'),
// ]),
// getItem('新闻管理', '/news-manage', <AppstoreOutlined />, [
// ]),
// getItem('审核管理', '/audit-manage', <AppstoreOutlined />, [
// ]),
// getItem('发布管理', '/release-manage', <AppstoreOutlined />, [
// ]),
