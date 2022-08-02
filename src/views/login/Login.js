import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import './Login.css';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

function Login(props) {
    const onFinish = values => {
        // console.log('收集到的值', values);
        //get请求来到后端校验有没有这个字段，还要保证roleState是打开状态的，实际情况下是后端去校验roleState字段，而不是前端发过去
        axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
            console.log(res.data);
            if (res.data.length === 0) {
                message.error('密码输入错误');
            } else {
                localStorage.setItem('token', JSON.stringify(res.data[0])); //信息明文的存在了Token里面，但是实际情况不会这样
                props.history.push('/home');
            }
        });
    };
    const particlesInit = async main => {
        // console.log(main);
        await loadFull(main);
    };

    const particlesLoaded = container => {
        // console.log(container);
    };
    return (
        <div className='formContainner' style={{ background: 'rgb(35,39,65)', height: ' 100vh' }}>
            <Particles
                id='tsparticles'
                init={particlesInit}
                loaded={particlesLoaded}
                options={{
                    background: {
                        color: {
                            value: 'rgb(35,39,65)'
                        }
                    },
                    fpsLimit: 120,
                    interactivity: {
                        events: {
                            onClick: {
                                enable: true,
                                mode: 'push'
                            },
                            onHover: {
                                enable: true,
                                mode: 'repulse'
                            },
                            resize: true
                        },
                        modes: {
                            push: {
                                quantity: 4
                            },
                            repulse: {
                                distance: 100, //半径
                                duration: 0.8
                            }
                        }
                    },
                    particles: {
                        color: {
                            value: '#ffffff' //球颜色
                        },
                        links: {
                            color: '#ffffff', //线颜色
                            distance: 150,
                            enable: true,
                            opacity: 0.5,
                            width: 1
                        },
                        collisions: {
                            enable: true
                        },
                        move: {
                            direction: 'none',
                            enable: true,
                            outModes: {
                                default: 'bounce'
                            },
                            random: false,
                            speed: 2,
                            straight: false
                        },
                        number: {
                            density: {
                                enable: true,
                                area: 600
                            },
                            value: 60
                        },
                        opacity: {
                            value: 0.5
                        },
                        shape: {
                            type: 'circle'
                        },
                        size: {
                            value: { min: 1, max: 5 }
                        }
                    },
                    detectRetina: true
                }}
            />
            <div className='form'>
                <div className='logintitle'>学生公寓新闻管理系统</div>
                <Form name='normal_login' className='login-form' onFinish={onFinish}>
                    <Form.Item
                        name='username'
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Username!'
                            }
                        ]}
                    >
                        <Input prefix={<UserOutlined className='site-form-item-icon' />} placeholder='Username' />
                    </Form.Item>
                    <Form.Item
                        name='password'
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!'
                            }
                        ]}
                    >
                        <Input prefix={<LockOutlined className='site-form-item-icon' />} type='password' placeholder='Password' />
                    </Form.Item>

                    <Form.Item>
                        <Button type='primary' htmlType='submit' className='login-form-button'>
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
export default withRouter(Login);
