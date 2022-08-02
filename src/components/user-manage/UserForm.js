import React, { forwardRef, useState, useEffect } from 'react'
import { Form, Select, Input } from 'antd'

const { Option } = Select;

const UserForm = forwardRef((props, ref) => {
    const { form, regionList, roleList, updateDisabled, isUpdate } = props
    const [isDisabled, setIsDisabled] = useState(false)
    const { roleId, region } = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        setIsDisabled(updateDisabled)
    }, [updateDisabled])
    const checkRegionDisabled = (optionRegion) => {
        if (isUpdate) {//更新
            if (roleId === 1) {//超级管理员
                return false
            } else {
                return true
            }
        }
        else {//创建
            if (roleId === 1) {//超级管理员
                return false
            } else {
                return region !== optionRegion
            }
        }
    }
    const checkRoleDisabled = (optionRole) => {
        if (isUpdate) {//更新
            if (roleId === 1) {//超级管理员
                return false
            } else {
                return true
            }
        }
        else {//创建
            if (roleId === 1) {//超级管理员
                return false
            } else {
                return roleId >= optionRole
            }
        }
    }
    return (
        <Form ref={ref} form={form} layout="vertical" name="form_in_modal" >
            <Form.Item
                name="username"
                label="用户名"
                rules={[
                    {
                        required: true,
                        message: '请输入用户名!',
                    },
                ]}>
                <Input />
            </Form.Item>

            <Form.Item
                name="password"
                label="密码"
                rules={[
                    {
                        required: true,
                        message: '请输入密码!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="region"
                label="区域"
                rules={isDisabled ? [] : [{ required: true, message: '请输入区域!', },
                ]}
            >
                <Select disabled={isDisabled}>{
                    regionList.map(item => <Option key={item.id} value={item.value} disabled={checkRegionDisabled(item.value)}>{item.title}</Option>)
                }
                </Select>
            </Form.Item>

            <Form.Item
                name="roleId"
                label="角色"
                rules={[
                    {
                        required: true,
                        message: '请输入身份!',
                    },
                ]}>
                <Select onChange={(value) => {
                    console.log(value);
                    if (value === 1) {
                        setIsDisabled(true)

                        ref.current.setFieldsValue({
                            region: ''
                        })
                    } else {
                        setIsDisabled(false)
                    }
                }}>
                    {roleList.map(item => <Option key={item.id} value={item.id} disabled={checkRoleDisabled(item.id)}>{item.roleName}</Option>)}
                </Select>
            </Form.Item>
        </Form>
    )
})
export default UserForm