import React from 'react'
import { Table } from 'antd'

export default function Newspublish(props) {
    const { dataSource, button } = props
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
            title: '操作',
            // dataIndex: 'key',//不写item就是整个删除项
            render: (item) => {
                return <div>
                    {button(item.id)}
                </div>
            }
        }
    ];

    return (
        <div>
            <Table rowKey={item => item.id} dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
        </div>
    )
}
