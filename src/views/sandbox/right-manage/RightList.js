import React, { useState, useEffect } from 'react'
import { Table, Tag, Popover, Button, Modal, Switch } from 'antd'

import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios';
const { confirm } = Modal;
export default function RightList() {
    const [dataSource, setDataSource] = useState()
    useEffect(() => {
        axios.get('/rights?_embed=children').then(res => {
            // console.log(res.data);
            const list = res.data
            list.forEach((item) =>
                item.children.length === 0 ? item.children = '' : item.children
            )
            setDataSource(list)
        })
    }, [])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: id => {
                return <b>{id}</b>
            }
        },
        {
            title: '权限名称',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            key: 'key',
            render: key => {
                let color = 'orange';
                return (
                    <Tag color={color} key={key}>{key}</Tag>
                );
            }
        },
        {
            title: '操作',
            // dataIndex: 'key',//不写item就是整个删除项
            render: (item) => {
                return <div>
                    <Button shape="circle" danger onClick={() => confirmMethod(item)}><DeleteOutlined /></Button>
                    <Popover content={<div><Switch checked={item.pagepermisson} onChange={() => switchMethod(item)}></Switch></div>} title="配置项" trigger={item.pagepermisson === undefined ? '' : 'click'}>
                        <Button type="primary" shape="circle" disabled={item.pagepermisson === undefined}><EditOutlined /></Button>
                    </Popover>
                </div>
            }
        }
    ];
    const switchMethod = (item) => {
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
        console.log(item);
        setDataSource([...dataSource])
        // 后端patch补丁更新
        if (item.grade === 1) {
            axios.patch(`/rights/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        } else {
            axios.patch(`/children/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        }
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
        // console.log(item);
        // 当前页面同步状态+后端同步， 
        if (item.grade === 1) {
            axios.delete(`/rights/${item.id}`)
            setDataSource(dataSource.filter(data => {
                // console.log(data)
                return data.id !== item.id
            }))
        }
        else {
            axios.delete(`/children/${item.id}`)
            let list = dataSource.filter(data => data.id === item.rightId)//筛选出被修改子项的父项，此时dataSource没有被改变
            list[0].children = list[0].children.filter((data) => data.id !== item.id)//筛选出被修改的子项，此时dataSource被改变了，因为是上面赋值时传的是children地址
            // console.log(list[0]);
            setDataSource([...dataSource])//此时我们只需要传入现在的dataSource就好了,但是一级没有改变是没有影响的，需要展开再重组
        }

    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
        </div>
    )
}
