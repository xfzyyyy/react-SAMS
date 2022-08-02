import Newspublish from '../../../components/news-manage/Newspublish';
import usePublish from '../../../components/news-manage/usePublish';

import { Button } from 'antd'
export default function Published(props) {
    const { dataSource, setDataSource, handlePublished } = usePublish(2, props)

    return (
        <div>
            <Newspublish dataSource={dataSource} setDataSource={setDataSource} button={(id) => <Button danger onClick={() => handlePublished(id)}>下线</Button>} />
        </div>
    )
}
