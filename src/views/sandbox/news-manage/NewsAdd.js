import React, { useState, useEffect, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import { Button, PageHeader, Steps, Form, Input, Select, message, notification } from 'antd';
import style from './news.module.css'
import axios from 'axios';
import NewsEditor from '../../../components/news-manage/NewsEditor';
const { Step } = Steps;
const { Option } = Select;
function NewsAdd(props) {
    const [current, setCurrent] = useState(0)
    const [categories, setCategories] = useState([])
    const [formInfo, setFormInfo] = useState({})//表单收集到的
    const [content, setContent] = useState('')//新闻内容
    const NewsForm = useRef()
    const user = JSON.parse(localStorage.getItem('token'))

    const handleSave = (auditState) => {
        axios.post('/news', {
            ...formInfo,
            "content": content,
            "region": user.region ? user.region : '全区',
            "author": user.username,
            "roleId": user.roleId,
            "auditState": auditState,//0草稿箱，1提交审核
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            // "publishTime": 0
        }).then(
            res => {
                props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')
                notification.info({
                    message: `通知`,
                    description:
                        `您可以在${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
                    placement: 'bottomRight',
                });
            }
        )
    }
    const handleNext = () => {
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                // console.log(res);
                setFormInfo(res)
                setCurrent(current + 1)
            }).catch(err => {
                console.log(err);
            })
        } else {
            // console.log(content);
            if (content === '<p></p>\n' || content === '') {
                message.error('请输入新闻内容！')
            } else {
                setCurrent(current + 1)
                // console.log(formInfo, content);
            }
        }
    }
    const handlePrev = () => { setCurrent(current - 1) }
    useEffect(() => {
        axios.get('/categories').then((res) => setCategories(res.data))
    }, [])
    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="撰写新闻"
                subTitle="This is a subtitle"
            />
            <Steps current={current}>
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主体内容" />
                <Step title="新闻提交" description="新闻保存草稿或者提交审核" />
            </Steps>

            <div style={{ margin: '40px', minHeight: '100px' }} >
                {/* 如果用条件渲染会重新创建dom和删除，比如input中的内容保存不下来，还要用状态来保存，很麻烦，所以我们可以用css的dispaly来隐藏dom元素，就不必要大费周章了 */}
                < div className={current === 0 ? '' : style.active}>
                    <Form
                        ref={NewsForm}
                        name="basic"
                        labelCol={{
                            span: 4,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入新闻标题!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择新闻分类!',
                                },
                            ]}
                        >
                            <Select
                                placeholder="选择新闻分类"
                            >
                                {
                                    categories.map(item =>
                                        <Option key={item.id} value={item.id}>{item.title}</Option>
                                    )
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
                <div className={current === 1 ? '' : style.active}>
                    <NewsEditor getContent={(value) => {
                        // console.log(value);
                        setContent(value)
                    }}></NewsEditor>
                </div>
                <div className={current === 2 ? '' : style.active}>

                </div>
            </div>

            <div>
                {
                    current === 2 && <span>
                        <Button type='primary' onClick={() => handleSave(0)}>保存草稿箱</Button>
                        <Button type='danger' onClick={() => handleSave(1)}>提交审核</Button>
                    </span>
                }
                {
                    current < 2 && <Button type='primary' onClick={handleNext}>下一步</Button>

                }
                {
                    current > 0 && <Button onClick={handlePrev}>上一步</Button>
                }
            </div>
        </div >
    )
}
export default withRouter(NewsAdd)