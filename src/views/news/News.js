import React, { useEffect, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { PageHeader, Card, Col, Row, List } from 'antd';
export default function News() {
    const [list, setList] = useState([]);
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category').then(res => {
            // setAllList(res.data)
            // console.log(Object.entries(_.groupBy(res.data, item => item.category.title)))
            setList(Object.entries(_.groupBy(res.data, item => item.category.title)));
        }, []);
    }, []);
    return (
        <div>
            <PageHeader className='site-page-header' title='学生公寓新闻管理系统' subTitle='查看新闻' />
            <div className='site-card-wrapper1' style={{ width: '95%', padding: '0 auto' }}>
                <Row gutter={[16, 16]}>
                    {list.map(item => {
                        return (
                            <Col span={8} key={item[0]}>
                                <Card title={item[0]} bordered={false} hoverable={true}>
                                    <List
                                        pagination={{
                                            pageSize: 3
                                        }}
                                        size='small'
                                        dataSource={item[1]}
                                        renderItem={data => (
                                            <List.Item>
                                                <a href={`#/detail/${data.id}`}>{data.title}</a>
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </div>
        </div>
    );
}
