import React, { useEffect, useState } from 'react'
import { Descriptions, PageHeader } from 'antd';
import axios from 'axios';
import moment from 'moment'
export default function NewsPreview(props) {
    const [newsInfo, setNewsInfo] = useState(null)
    useEffect(() => {
        // console.log(props.match.params.id);
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            setNewsInfo(res.data)
        })
        // console.log(newsInfo);
    }, [props.match.params.id])
    const auditList = ['未审核', '审核中', '已通过', '未通过']
    const publishList = ['未发布', '待发布', '已上线', '已下线']
    const colorList = ['black', 'orange', 'green', 'red']
    return (
        <div >
            {
                newsInfo && <div>
                    <PageHeader
                        ghost={false}
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={newsInfo.category.title}
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                            {/* HH为24进制时间，hh为12进制时间 */}
                            <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss')}</Descriptions.Item>
                            <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.publishTime).format('YYYY/MM/DD HH:mm:ss') : '-'}</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                            <Descriptions.Item label="审核状态"><span style={{ color: colorList[newsInfo.auditState] }}>{auditList[newsInfo.auditState]}</span></Descriptions.Item>
                            <Descriptions.Item label="发布状态"><span style={{ color: newsInfo.auditState[newsInfo.publishState] }}>{publishList[newsInfo.publishState]}</span></Descriptions.Item>
                            <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                            <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                            <Descriptions.Item label="评论数量">{newsInfo.publishState}</Descriptions.Item>
                        </Descriptions>
                    </PageHeader>
                    {/* 防止跨站脚本攻击，把输入文本的地方输入一些脚本，防止用户上传的一些html存到数据库再返回回来，默认不支持html dom解析，用属性dangerouslySetInnerHTML={{__html: newsInfo.content}} */}
                    <div dangerouslySetInnerHTML={{
                        __html: newsInfo.content
                    }} style={{ margin: '0 24px', border: '1px solid gray', minHeight: '200px' }}>
                    </div>
                </div>
            }

        </div >
    )
}
