import React, { useContext, useState, useEffect, useRef } from 'react'
import { Table, Input, Button, Form, Modal } from 'antd'

import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios';
const { confirm } = Modal;
export default function NewsCategory(props) {
    const EditableContext = React.createContext(null);
    const [dataSource, setDataSource] = useState()
    useEffect(() => {
        axios.get(`/categories`).then(res => {
            // console.log(res.data);
            const list = res.data
            setDataSource(list)
        })
    }, [])
    const handleSave = (row) => {
        console.log(row);
        setDataSource(dataSource.map(item => {
            if (item.id === row.id) {
                return {
                    id: item.id,
                    title: row.title,
                    value: row.title
                }
            }
            return item
        }));
        axios.patch(`/categories/${row.id}`, {
            title: row.title,
            value: row.title
        })
    };
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: id => {
                return <b>{id}</b>
            }
        },
        {
            dataIndex: 'title',
            title: '栏目名称',
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: 'title',
                title: '区域名称',
                handleSave,
            }),
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button shape="circle" key={item.id} danger onClick={() => confirmMethod(item)}><DeleteOutlined /></Button>
                </div>
            }
        }
    ];
    const confirmMethod = (item) => {
        confirm({
            title: '确认删除？',
            icon: <ExclamationCircleOutlined />,
            content: '你真的要删除吗',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                deleteMethod(item);
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    }
    const deleteMethod = (item) => {
        // console.log(item);
        // 当前页面同步状态+后端同步， 
        axios.delete(`/categories/${item.id}`)
        setDataSource(dataSource.filter(data => {
            // console.log(data)
            return data.id !== item.id
        }))
    }
    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };

    const EditableCell = ({
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
    }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
            if (editing) {
                inputRef.current.focus();
            }
        }, [editing]);

        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        };

        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({ ...record, ...values });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };

        let childNode = children;

        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }
        return <td {...restProps}>{childNode}</td>;
    };
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    return (
        <div>
            <Table components={components} rowKey={item => item.id} dataSource={dataSource} columns={columns} pagination={{ pageSize: 6 }} />
        </div>
    )
}