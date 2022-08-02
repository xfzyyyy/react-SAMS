import React, { useEffect, useState } from 'react'
import { Descriptions, PageHeader } from 'antd';
import axios from 'axios';
import { HeartTwoTone } from '@ant-design/icons';

import moment from 'moment'
export default function Detail(props) {
    const [newsInfo, setNewsInfo] = useState(null)
    useEffect(() => {
        // console.log(props.match.params.id);
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            setNewsInfo({
                ...res.data,
                view: res.data.view + 1
            })
            return res.data
        }).then(res => {
            axios.patch(`/news/${props.match.params.id}`, {
                view: res.view + 1
            })
        })
        // console.log(newsInfo);
    }, [props.match.params.id])
    const handleStar = () => {
        setNewsInfo({
            ...newsInfo,
            star: newsInfo.star + 1
        })
        axios.patch(`/news/${props.match.params.id}`, {
            star: newsInfo.star + 1
        })
    }
    return (
        <div >
            {
                newsInfo && <div>
                    <PageHeader
                        ghost={false}
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={<div>newsInfo.category.title <HeartTwoTone twoToneColor="#eb2f96" onClick={handleStar} /></div>}
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                            {/* HH为24进制时间，hh为12进制时间 */}
                            <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.publishTime).format('YYYY/MM/DD HH:mm:ss') : '-'}</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                            <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                            <Descriptions.Item label="评论数量">{newsInfo.publishState}</Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                    {/* 防止跨站脚本攻击，把输入文本的地方输入一些脚本，防止用户上传的一些html存到数据库再返回回来，默认不支持html dom解析，用属性dangerouslySetInnerHTML={{__html: newsInfo.content}} */}
                    <div dangerouslySetInnerHTML={{
                        __html: newsInfo.content
                    }} style={{ margin: '0 24px', minHeight: '200px' }}>
                    </div>
                </div>
            }
        </div>
    )
}
