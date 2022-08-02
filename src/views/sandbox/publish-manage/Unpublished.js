import Newspublish from '../../../components/news-manage/Newspublish';
import usePublish from '../../../components/news-manage/usePublish';
import { Button } from 'antd'

export default function Unpublished(props) {
    const { dataSource, setDataSource, handlePublish } = usePublish(1, props)

    return (
        <div>
            <Newspublish dataSource={dataSource} setDataSource={setDataSource} button={(id) => <Button type='primary' onClick={() => handlePublish(id)}>发布</Button>} />
        </div>
    )
}
