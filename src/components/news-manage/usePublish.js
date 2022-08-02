import { useState, useEffect } from 'react'
import axios from 'axios';
import { notification } from 'antd'

function usePublish(type, props) {
    // console.log(props);
    const [dataSource, setDataSource] = useState()
    const { username } = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
            // console.log(res.data);
            const list = res.data
            setDataSource(list)
        })
    }, [username, type])
    //下线
    const handlePublished = (id) => {
        axios.patch(`/news/${id}`, {
            publishState: 3
        }).then(res => {
            props.history.push(`/publish-manage/sunset`)
            notification.info({
                message: '通知',
                description: `新闻下线成功`,
                placement: 'bottomRight'
            })
        })
        setDataSource(dataSource.filter(item => item.id !== id))
    }
    //发布
    const handlePublish = (id) => {
        axios.patch(`/news/${id}`, {
            publishState: 2,
            publishTime: Date.now()
        }).then(res => {
            props.history.push(`/publish-manage/published`)
            notification.info({
                message: '通知',
                description: `新闻发布成功`,
                placement: 'bottomRight'
            })
        })
        setDataSource(dataSource.filter(item => item.id !== id))

    }
    // 删除
    const handleSunset = (id) => {
        axios.delete(`/news/${id}`).then(res => {
            notification.info({
                message: '通知',
                description: `新闻删除成功`,
                placement: 'bottomRight'
            })
        })
        setDataSource(dataSource.filter(item => item.id !== id))
    }
    return {
        dataSource, setDataSource, handlePublish, handlePublished, handleSunset
    }
}
export default usePublish