import { List, Input, Button, Typography, message } from 'antd'
import { CheckOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons'
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

  const handleCreateDuty = (name: string) => {
    return dutyRemoteService
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
  }

  const handleUpdateDuty = (duty: Duty) => {
    return dutyRemoteService
      .updateDuty(duty)
      .then(() => {
        return dutyRemoteService.listDuties()
      })
      .then((duties) => {
        setDuties(duties)
      })
  }

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
            handleCreateDuty(inputValue)
          }}
        >
          Add
        </Button>
      </div>
      <DutiesList duties={duties} onUpdateDuty={handleUpdateDuty} />
    </div>
  )
}

const DutiesList = ({
  duties,
  onUpdateDuty,
}: {
  duties: Duty[]
  onUpdateDuty: (duty: Duty) => Promise<unknown>
}) => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')

  return (
    <List
      header={<Title level={4}>Duties List</Title>}
      bordered
      dataSource={duties}
      renderItem={(item, index) => (
        <List.Item
          actions={[
            editingId === item.id ? (
              <Button
                data-testid={`save-button-${index}`}
                shape="circle"
                icon={<SaveOutlined />}
                onClick={() => {
                  onUpdateDuty({ ...item, name: editingValue }).then(() => {
                    setEditingId(null)
                  })
                }}
              ></Button>
            ) : (
              <Button
                data-testid={`edit-button-${index}`}
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => {
                  setEditingValue(item.name)
                  setEditingId(item.id)
                }}
              />
            ),
            <Button
              shape="circle"
              icon={<CheckOutlined />}
              onClick={() => {}}
            />,
          ]}
        >
          {editingId === item.id ? (
            <Input
              value={editingValue}
              onChange={(e) => {
                setEditingValue(e.target.value)
              }}
            />
          ) : (
            <Text>{item.name}</Text>
          )}
        </List.Item>
      )}
    />
  )
}

export default App
