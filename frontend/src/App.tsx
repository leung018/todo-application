import { List, Input, Button, Typography, message } from 'antd'
import { CheckOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons'
import { DutyRemoteService } from './services/duty'
import { DUTY_MAX_NAME_LENGTH, Duty } from './models/duty'
import { useEffect, useState, useCallback } from 'react'

const { Text, Title } = Typography

const App = ({
  dutyRemoteService,
}: {
  dutyRemoteService: DutyRemoteService
}) => {
  const [duties, setDuties] = useState<Duty[]>([])
  const [messageApi, contextHolder] = message.useMessage()

  const loadDutiesFromRemoteToState = useCallback(async () => {
    return dutyRemoteService
      .listDuties()
      .then((duties) => {
        setDuties([...duties])
      })
      .catch((error) => {
        messageApi.error(error.message)
      })
  }, [dutyRemoteService, messageApi])

  useEffect(() => {
    loadDutiesFromRemoteToState()
  }, [loadDutiesFromRemoteToState])

  const handleCreateDuty = async (dutyName: string) => {
    if (!dutyName.trim()) {
      messageApi.info('Please input the duty.')
      return
    }
    if (dutyName.length > DUTY_MAX_NAME_LENGTH) {
      messageApi.info(
        `Duty name should not exceed ${DUTY_MAX_NAME_LENGTH} characters.`,
      )
      return
    }

    return dutyRemoteService
      .createDuty(dutyName)
      .then(() => {
        return loadDutiesFromRemoteToState()
      })
      .catch((error) => {
        messageApi.error(error.message)
      })
  }

  const handleUpdateDuty = async (duty: Duty) => {
    if (!duty.name.trim()) {
      messageApi.info('Cannot edit duty to empty.')
      return
    }
    if (duty.name.length > DUTY_MAX_NAME_LENGTH) {
      messageApi.info(
        `Duty name should not exceed ${DUTY_MAX_NAME_LENGTH} characters.`,
      )
      return
    }

    return dutyRemoteService
      .updateDuty(duty)
      .then(() => {
        return loadDutiesFromRemoteToState()
      })
      .catch((error) => {
        messageApi.error(error.message)
      })
  }

  const handleCompleteDuty = async (dutyId: string) => {
    return dutyRemoteService
      .completeDuty(dutyId)
      .then(() => {
        return loadDutiesFromRemoteToState()
      })
      .catch((error) => {
        messageApi.error(error.message)
      })
  }

  return (
    <div style={{ margin: '24px auto', maxWidth: '600px' }}>
      {contextHolder}
      <DutyInput onCreateDuty={handleCreateDuty} />
      <DutiesList
        duties={duties}
        onUpdateDuty={handleUpdateDuty}
        onCompleteDuty={handleCompleteDuty}
      />
    </div>
  )
}

const DutyInput = ({
  onCreateDuty,
}: {
  onCreateDuty: (dutyName: string) => Promise<unknown>
}) => {
  const [inputValue, setInputValue] = useState('')
  return (
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
          onCreateDuty(inputValue).then(() => {
            setInputValue('')
          })
        }}
      >
        Add
      </Button>
    </div>
  )
}

const DutiesList = ({
  duties,
  onUpdateDuty,
  onCompleteDuty,
}: {
  duties: Duty[]
  onUpdateDuty: (duty: Duty) => Promise<unknown>
  onCompleteDuty: (dutyId: string) => Promise<unknown>
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
              data-testid={`complete-button-${index}`}
              shape="circle"
              icon={<CheckOutlined />}
              onClick={() => {
                onCompleteDuty(item.id)
              }}
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
