import Newspublish from '../../../components/news-manage/Newspublish';
import usePublish from '../../../components/news-manage/usePublish';

import { Button } from 'antd'
export default function Sunset(props) {
    const { dataSource, setDataSource, handleSunset } = usePublish(3, props)

    return (
        <div>
            <Newspublish dataSource={dataSource} setDataSource={setDataSource} button={(id) => <Button type='danger' onClick={() => handleSunset(id)}>删除</Button>} />
        </div>
    )
}
