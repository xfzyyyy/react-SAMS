import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Button, notification, } from 'antd'

export default function Audit() {
    const [dataSource, setDataSource] = useState()//用户列表
    const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))//为了判断各个角色看到的角色列表
    useEffect(() => {
        const roleObj = {
            1: 'superadmin',
            2: 'admin',
            3: 'editor',
        }
        axios.get(`/news?auditState=1&_expand=category`).then(res => {
            // console.log(res.data);
            const list = res.data
            setDataSource(roleObj[roleId] === 'superadmin' ? list :
                [...list.filter(item => item.author === username),
                ...list.filter(item => item.region === region && roleObj[item.roleId] === 'editor')
                ])
        })
    }, [region, roleId, username])
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
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: category => category.value
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button type="primary" disabled={item.default} onClick={() => {
                        handleAudit(item, 2, 1)
                    }}>通过</Button>
                    <Button danger disabled={item.default} onClick={() => {
                        handleAudit(item, 3, 0)
                    }}>驳回</Button>
                </div>
            }
        }
    ];
    const handleAudit = (item, auditState, publishState) => {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.patch(`news/${item.id}`, {
            auditState: auditState,
            publishState: publishState
        }).then(res => {
            notification.info({
                message: `通知`,
                description: `您可以在[审核管理->审核列表]查看审核状态`,
                //可以给用户发邮件告诉审核成功
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
