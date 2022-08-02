import React, { useState, useEffect } from 'react'
import { Table, Button, notification, Tag } from 'antd'

import axios from 'axios';

export default function AuditList(props) {
    const [dataSource, setDataSource] = useState()
    const { username } = JSON.parse(localStorage.getItem('token'))
    const colorList = ['black', 'orange', 'green', 'red']
    const auditList = ['未审核', '审核中', '已通过', '未通过']
    useEffect(() => {
        // 作者是要自己
        //auditState!==0就是不是草稿箱中的内容
        // publishState<=1就是未发布的0未发布，1待发布， 2已发布，3已下线
        // _ne=0不等于0，_lte=1小于等于1
        axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
            // console.log(res.data);
            const list = res.data
            setDataSource(list)
        })
    }, [username])
    const columns = [

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
            title: '审核状态',
            dataIndex: 'auditState',
            key: 'auditState',
            render: auditState => {
                return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
            }
        },
        {
            title: '操作',
            // dataIndex: 'key',//不写item就是整个删除项
            render: (item) => {
                return <div>
                    {
                        item.auditState === 1 && <Button onClick={() => {
                            // console.log(item);
                            handleRevert(item)
                        }}>撤销</Button>
                    }
                    {
                        item.auditState === 2 && <Button type="primary" danger onClick={() => {
                            // console.log(item);
                            handlePublish(item)
                        }}>发布</Button>
                    }
                    {
                        item.auditState === 3 && <Button type="primary" onClick={() => {
                            // console.log(item);
                            handleUpdate(item)
                        }}>更新</Button>
                    }

                </div>
            }
        }
    ];
    const handleUpdate = (item) => {
        props.history.push(`/news-manage/update/${item.id}`)
    }
    const handlePublish = (item) => {
        axios.patch(`/news/${item.id}`, {
            'publishState': 2,
            'publishTime': Date.now()
        }).then(res => {
            props.history.push(`/publish-manage/published`)
            notification.info({
                message: '通知',
                description: `你可以到[发布管理->已发布]中查看你的新闻`,
                placement: 'bottomRight'
            })
        })
    }
    const handleRevert = (item) => {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.patch(`/news/${item.id}`, {
            auditState: 0
        }).then(res => {
            // props.history.push(`/audit-manage/list`)
            notification.info({
                message: '通知',
                description: `你可以到草稿箱中查看你的新闻`,
                placement: 'bottomRight'
            })
        })
    }
    return (
        <div>
            <Table rowKey={item => item.id} dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
        </div>
    )
}
