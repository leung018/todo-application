import { List, Input, Button, Typography, message } from 'antd'
import { CheckOutlined, EditOutlined } from '@ant-design/icons'
import { DutyRemoteService } from './services/duty'
import { Duty } from './models/duty'
import { useEffect, useState } from 'react'

const { Text, Title } = Typography

const App = ({
  dutyRemoteService,
}: {
  dutyRemoteService: DutyRemoteService
}) => {
  const [duties, setDuties] = useState<Duty[]>([])
  const [inputValue, setInputValue] = useState('')
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    dutyRemoteService.listDuties().then((duties) => {
      setDuties(duties)
    })
  }, [dutyRemoteService])

  return (
    <div style={{ margin: '24px auto', maxWidth: '600px' }}>
      {contextHolder}
      <div style={{ marginBottom: '24px' }}>
        <Input
          placeholder="Add new duty"
          style={{ width: '100%' }}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
          }}
        />
        <Button
          type="primary"
          style={{ marginTop: '5px' }}
          onClick={() => {
            dutyRemoteService
              .createDuty(inputValue)
              .then(() => {
                setInputValue('')
                return dutyRemoteService.listDuties()
              })
              .then((duties) => {
                setDuties(duties)
              })
              .catch((error) => {
                messageApi.error(error.message)
              })
          }}
        >
          Add
        </Button>
      </div>
      <DutiesList duties={duties} />
    </div>
  )
}

const DutiesList = ({ duties }: { duties: Duty[] }) => {
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <List
      header={<Title level={4}>Duties List</Title>}
      bordered
      dataSource={duties}
      renderItem={(item) => (
        <List.Item
          actions={[
            <Button
              data-testid={`edit-button-${item.id}`}
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingId(item.id)
              }}
            />,
            <Button
              shape="circle"
              icon={<CheckOutlined />}
              onClick={() => {}}
            />,
          ]}
        >
          {editingId === item.id ? (
            <Input value={item.name} />
          ) : (
            <Text>{item.name}</Text>
          )}
        </List.Item>
      )}
    />
  )
}

export default App
