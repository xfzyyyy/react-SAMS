import React, { useState, useEffect, useRef } from 'react'
import UserForm from '../../../components/user-manage/UserForm';
import { Table, Button, Modal, Switch, } from 'antd'

import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios';
const { confirm } = Modal;
export default function UesrList() {
    const [dataSource, setDataSource] = useState()//用户列表
    const [roleList, setRoleList] = useState([])//角色列表
    const [regionList, setRegionList] = useState([])//区域列表
    const [visible, setVisible] = useState(false)//添加用户框的显示
    const [updateVisible, setUpdateVisible] = useState(false)//更新框的显示
    const [updateDisabled, setUpdateDisabled] = useState(false)//用于禁用表单超级管理员的区域选择
    const [current, setCurrent] = useState(null)
    const addForm = useRef(null)
    const updateForm = useRef(null)
    const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))//为了判断各个角色看到的角色列表
    useEffect(() => {
        const roleObj = {
            1: 'superadmin',
            2: 'admin',
            3: 'editor',
        }
        axios.get('/users?_expand=role').then(res => {
            // console.log(res.data);
            const list = res.data
            setDataSource(roleObj[roleId] === 'superadmin' ? list :
                [...list.filter(item => item.username === username),
                ...list.filter(item => item.region === region && roleObj[item.roleId] === 'editor')
                ])
        })
        axios.get('/roles').then(res => {
            // console.log(res.data);
            const list = res.data
            setRoleList(list)
        })
        axios.get('/regions').then(res => {
            // console.log(res.data);
            const list = res.data

            setRegionList(list)
        })
    }, [region, roleId, username])
    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            filters: [...regionList.map(item => ({
                text: item.title,
                value: item.value
            })), {
                text: '全区',
                value: '全区'
            }],
            onFilter: (value, record) => {
                if (value === '全区') {
                    return record.region === ''
                } else {
                    return record.region === value
                }
            },
            render: region => {
                return <b>{region === '' ? '全区' : region}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: role => {
                return role?.roleName
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '用户状态',
            render: item => {
                return (
                    <Switch checked={item.roleState} onChange={() => onChangeState(item)} disabled={item.default} />
                );
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button shape="circle" danger onClick={() => confirmMethod(item)} disabled={item.default} ><DeleteOutlined /></Button>

                    <Button type="primary" shape="circle" disabled={item.default} onClick={() => handleUpdate(item)}><EditOutlined /></Button>

                </div>
            }
        }
    ];
    const onChangeState = (item) => {
        // console.log(item.roleState);
        item.roleState = !item.roleState
        setDataSource([...dataSource])
        axios.patch(`/users/${item.id}`, {
            roleState: item.roleState
        })
    }
    const handleUpdate = (item) => {
        //react状态更新不保证是同步的，放在异步里面就不会batchUpdates批量处理标志位false合并渲染
        setTimeout(() => {
            setUpdateVisible(true)
            setTimeout(() => {
                if (item.roleId === 1) {
                    setUpdateDisabled(true)
                } else {
                    setUpdateDisabled(false)
                }
                updateForm.current.setFieldsValue(item)
            }, 0)
        }, 0)
        setCurrent(item)
    }
    const confirmMethod = (item) => {
        confirm({
            title: '确认删除？',
            icon: <ExclamationCircleOutlined />,
            content: '你真的要删除吗',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                deleteMethod(item);
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    }
    const deleteMethod = (item) => {
        console.log(item);
        // 当前页面同步状态+后端同步 
        setDataSource(dataSource.filter(data => {
            return data.id !== item.id
        }))
        axios.delete(`/users/${item.id}`)
    }
    // const [form] = Form.useForm();
    // const onCreate = (values) => {
    //     console.log('Received values of form: ', values);
    //     setVisible(false);
    // };
    const onCancel = () => {
        setVisible(false);
    }
    const addFormOK = () => {
        // console.log('add', addForm);
        addForm.current.validateFields().then(value => {//收集成功
            // console.log(value);
            setVisible(false)
            addForm.current.resetFields()
            // post到后端，生成id，在设置datasource，方便后面的删除和更新
            axios.post('/users', {
                ...value,
                "roleState": true,
                "default": false,
            }).then(res => {
                console.log(res.data);
                setDataSource([...dataSource, {
                    ...res.data,
                    role: roleList.filter(item => item.id === value.roleId)[0]
                }])
            })
        }).catch(err => {
            // console.log(err);
        })
    }
    const updateFormOK = (item) => {
        updateForm.current.validateFields().then(value => {//收集成功
            // console.log(value);
            setUpdateVisible(false)
            setDataSource(dataSource.map(item => {
                if (item.id === current.id) {
                    return {
                        ...item,
                        ...value,
                        role: roleList.filter(item => item.id === value.roleId)[0]
                    }
                }
                return item
            }))
            setUpdateDisabled(!updateDisabled)
            // post到后端，更新
            axios.patch(`/users/${current.id}`, value)
        })
    }
    return (
        <div>
            <Button onClick={() => {
                setVisible(true);
            }}>添加用户</Button>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={(item) => item.id} />
            <Modal
                visible={visible}
                title="添加用户信息"
                okText="确定"
                cancelText="取消"
                onCancel={onCancel}
                onOk={() => addFormOK()}
            >
                <UserForm regionList={regionList} roleList={roleList} setVisible={setVisible} ref={addForm}></UserForm>
            </Modal>
            <Modal
                visible={updateVisible}
                title="更新用户信息"
                okText="确定"
                cancelText="取消"
                onCancel={() => {
                    setUpdateVisible(false)
                    setUpdateDisabled(!updateDisabled)
                }
                }
                onOk={() => updateFormOK()}
            >
                <UserForm regionList={regionList} roleList={roleList} setVisible={setVisible} ref={updateForm} updateDisabled={updateDisabled} isUpdate={true}></UserForm>
            </Modal>
        </div >
    )
}
