import { Modal, Table, Button, Tree } from 'antd'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal;

export default function RoleList() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [roleDataSource, setRoleDataSource] = useState([]);
    const [rightsDataSource, setRightsDataSource] = useState([])
    const [currentRights, setCurrentRights] = useState([])
    const [currentId, setCurrentId] = useState(0)
    useEffect(() => {
        axios.get('/roles').then(res => {
            console.log(res.data);
            setRoleDataSource(res.data)
        });
        axios.get('/rights?_embed=children').then(res => {
            // console.log(res.data);
            const list = res.data
            list.forEach((item) =>
                item.children.length === 0 ? item.children = '' : item.children
            )
            setRightsDataSource(list)
        })
    }, [])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            // key: 'id',
            render: (text) => <b>{text}</b>,
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
            // key: 'id',
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button shape="circle" danger onClick={() => confirmMethod(item)}><DeleteOutlined /></Button>
                    <Button type="primary" shape="circle" onClick={() => {
                        showModal()
                        setCurrentRights(item.rights)
                        setCurrentId(item.id)
                    }}><UnorderedListOutlined /></Button>
                </div>
            }
        },
    ];
    const confirmMethod = (item) => {
        confirm({
            title: '确认删除?',
            icon: <ExclamationCircleOutlined />,
            content: '三思啊！',
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
    };
    const deleteMethod = (item) => {
        console.log(item);
        // 当前页面同步状态+后端同步， 
        axios.delete(`/roles/${item.id}`)
        setRoleDataSource(roleDataSource.filter(data => {
            return data.id !== item.id
        }))
    }
    // const onSelect = (selectedKeys, info) => {
    //     console.log('selected', selectedKeys, info);
    // };
    const showModal = () => {
        setIsModalVisible(true);
    };

    const onCheck = (checkedKeys) => {
        // console.log('onCheck', checkedKeys, info);
        setCurrentRights(checkedKeys)
    };

    const handleOk = () => {
        console.log(currentRights.checked);
        setIsModalVisible(false);
        setRoleDataSource(roleDataSource.map(item => {
            if (item.id === currentId) {
                return {
                    ...item,
                    rights: currentRights
                }
            }
            return item
        }))
        //改后端
        axios.patch(`/roles/${currentId}`, { rights: currentRights })
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    return (
        <div>
            <Table columns={columns} dataSource={roleDataSource} rowKey={(item) => item.id} />
            <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    // defaultExpandedKeys={['/user-manage']}//默认展开的树节点
                    checkedKeys={currentRights}
                    onCheck={onCheck}
                    checkStrictly={true}//checkable状态下节点选择完全受控（父子节点选中状态不再关联）
                    treeData={rightsDataSource}
                />
            </Modal>
        </div>
    )
}


