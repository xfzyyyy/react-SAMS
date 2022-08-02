import { React } from 'react'
import { withRouter } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import { connect } from 'react-redux';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
} from '@ant-design/icons';

const { Header } = Layout;
function TopHeader(props) {
    // console.log(props);
    //不用自己的状态了，用redux管理
    // const [collapsed, setCollapsed] = useState(false)
    const changeCollapsed = () => {
        // setCollapsed(!collapsed)
        // console.log(props);
        props.changeCollapsed()
    }
    const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'))
    const menu = (
        <Menu
            items={[
                {
                    label: roleName,
                },
                {
                    danger: true,
                    label: '退出登录',
                    onClick: () => {
                        // console.log(localStorage);
                        // console.log(props);
                        // 删除token
                        localStorage.removeItem('token')
                        // localStorage.setItem('token', '123')//增加token
                        // 重定向到login
                        props.history.replace('/login')
                    }
                },
            ]}
        />
    );
    return (
        <Header className="site-layout-background" style={{
            padding: '16px', lineHeight: '32px'
        }}>
            {
                props.isCollapsed ? <MenuUnfoldOutlined className='trigger' onClick={changeCollapsed} /> : <MenuFoldOutlined className='trigger' onClick={changeCollapsed} />
            }
            <div style={{ float: "right" }}>
                <span>欢迎{username}回来</span>
                <Dropdown overlay={menu}>
                    <span>
                        <Avatar size='large' icon={<UserOutlined />} style={{ lineHeight: '32px' }} />
                    </span>
                </Dropdown>
            </div>
        </Header >
    )
}
//状态映射成属性
const mapStateToProps = (state) => {
    const { CollapsedReducer: { isCollapsed } } = state
    // console.log(isCollapsed);
    return {
        isCollapsed
    }
}
const mapDispatchToProps = {
    changeCollapsed() {
        return {
            type: 'change_collapsed',
            // payload:
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader)) 