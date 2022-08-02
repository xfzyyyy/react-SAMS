import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, notification } from 'antd'

import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons'
import axios from 'axios';
const { confirm } = Modal;
export default function NewsDraft(props) {
    const [dataSource, setDataSource] = useState()
    const { username } = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
            // console.log(res.data);
            const list = res.data
            setDataSource(list)
        })
    }, [username])
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
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
            key: 'author',

        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: category => {
                return category.title;
            }
        },
        {
            title: '操作',
            // dataIndex: 'key',//不写item就是整个删除项
            render: (item) => {
                return <div>
                    <Button shape="circle" danger onClick={() => confirmMethod(item)}><DeleteOutlined /></Button>
                    <Button shape="circle" onClick={() => {
                        console.log(props);
                        props.history.push(`/news-manage/update/${item.id}`)
                    }}><EditOutlined /></Button>

                    <Button type="primary" shape="circle" onClick={() => {
                        // console.log(item);
                        handleCheck(item.id)
                    }}><UploadOutlined /></Button>
                </div>
            }
        }
    ];
    const handleCheck = (id) => {
        axios.patch(`/news/${id}`, {
            auditState: 1
        }).then(res => {
            props.history.push(`/audit-manage/list`)
            notification.info({
                message: '通知',
                description: `你可以到审核列表中查看你的新闻`,
                placement: 'bottomRight'
            })
        })
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
        axios.delete(`/news/${item.id}`)
        setDataSource(dataSource.filter(data => {
            // console.log(data)
            return data.id !== item.id
        }))
    }
    return (
        <div>
            <Table rowKey={item => item.id} dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
        </div>
    )
}
