import { List, Input, Button, Typography } from 'antd'
import { CheckOutlined, EditOutlined } from '@ant-design/icons'
import { DutyRemoteService } from './services/duty'

const { Text, Title } = Typography

const App = ({
  dutyRemoteService,
}: {
  dutyRemoteService: DutyRemoteService
}) => {
  return (
    <div style={{ margin: '24px auto', maxWidth: '600px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Input placeholder="Add new duty" style={{ width: '100%' }} />
        <Button type="primary" style={{ marginTop: '5px' }}>
          Add
        </Button>
      </div>
      <List
        header={<Title level={4}>Duties List</Title>}
        bordered
        dataSource={[{ id: 'dummy-id', name: 'Sample Duty' }]}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => {}}
              />,
              <Button
                shape="circle"
                icon={<CheckOutlined />}
                onClick={() => {}}
              />,
            ]}
          >
            <Text>{item.name}</Text>
          </List.Item>
        )}
      />
    </div>
  )
}

export default App
