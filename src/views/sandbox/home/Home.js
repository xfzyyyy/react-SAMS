import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import '../../../App.css'
import * as Echarts from 'echarts'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import _ from 'lodash'

const { Meta } = Card;
export default function Home() {
    const [visible, setVisible] = useState(false);
    const [allList, setAllList] = useState([])
    const [viewList, setViewList] = useState([])
    const [starList, setStarList] = useState([])
    const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))
    const barRef = useRef()
    const pieRef = useRef()
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then(res => {
            setViewList(res.data)
        }, [])
        axios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then(res => {
            setStarList(res.data)
        }, [])
    }, [])
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category').then(res => {
            setAllList(res.data)
            // console.log(_.groupBy(res.data, item => item.category.title))
            renderBarView(_.groupBy(res.data, item => item.category.title))
            // 组件销毁时将事件清空
            return () => {
                window.onresize = null
            }
        }, [])
    }, [])
    const renderBarView = (obj) => {
        var myChart = Echarts.init(barRef.current);
        // 指定图表的配置项和数据
        // console.log(Object.keys(obj));
        // console.log(Object.values(obj));
        var option = {
            title: {
                text: '新闻分类图示'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(obj),
                axisLabel: {
                    rotate: "45"
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    data: Object.values(obj).map(item => item.length)
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        //自适应屏幕，响应式
        // 绑定了事件，不要忘记销毁掉！
        window.onresize = () => {
            myChart.resize()
        }
    }
    const renderPieView = () => {
        var currentList = allList.filter(item => item.author === username)
        var groupObj = _.groupBy(currentList, item => item.category.title)
        // console.log(groupObj);
        var list = []
        for (var i in groupObj) {
            list.push({
                name: i,
                value: groupObj[i].length
            })
        }
        var myChart = Echarts.init(pieRef.current);
        var option;
        option = {
            title: {
                text: '个人新闻发布数量',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        option && myChart.setOption(option);
    }
    return (
        <div className="site-card-wrapper">
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered={true}>
                        <List
                            size="large"
                            dataSource={viewList}
                            renderItem={(item) => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={true}>
                        <List
                            size="large"
                            dataSource={starList}
                            renderItem={(item) => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        // style={{ width: 300 }}
                        cover={
                            <img
                                alt="cqupt"
                                src="https://img1.baidu.com/it/u=4152283591,340112734&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=346"
                            />
                        }
                        actions={[
                            <div onClick={() => {
                                setTimeout(() => {
                                    setVisible(true)
                                    setTimeout(() => {
                                        renderPieView()
                                    }, 0)
                                }, 0)

                            }}><EyeOutlined key="setting" ></EyeOutlined> 个人发布</div>,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                            title={username}
                            description={
                                <div><b>{region ? region : '全区'}</b>
                                    <span style={{ padding: '30px' }}>{roleName}</span> </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>
            <div ref={barRef} style={{ width: '100%', height: '400px', paddingTop: '20px' }}></div>
            <Drawer
                title="个人新闻分类"
                width={500}
                closable={false}
                onClose={() => {
                    setVisible(false);
                }}
                visible={visible}
            >
                <div ref={pieRef} style={{ width: '100%', height: '400px' }}></div>
            </Drawer>
        </div >
    )
}
