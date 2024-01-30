import { List, Input, Button, Typography, message } from 'antd'
import { CheckOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons'
import { DutyRemoteService } from './services/duty'
import { DUTY_MAX_NAME_LENGTH, Duty } from './models/duty'
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

  const handleCreateDuty = async () => {
    if (!inputValue.trim()) {
      messageApi.info('Please input the duty.')
      return
    }
    if (inputValue.length > DUTY_MAX_NAME_LENGTH) {
      messageApi.info(
        `Duty name should not exceed ${DUTY_MAX_NAME_LENGTH} characters.`,
      )
      return
    }

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
        return dutyRemoteService.listDuties()
      })
      .then((duties) => {
        setDuties(duties)
      })
      .catch((error) => {
        messageApi.error(error.message)
      })
  }

  const handleCompleteDuty = (dutyId: string) => {
    return dutyRemoteService
      .completeDuty(dutyId)
      .then(() => {
        return dutyRemoteService.listDuties()
      })
      .then((duties) => {
        setDuties(duties)
      })
      .catch((error) => {
        messageApi.error(error.message)
      })
  }

  return (
    <div style={{ margin: '24px auto', maxWidth: '600px' }}>
      {contextHolder}
      {/* TODO: It is better to refactor below into separate DutyInput component.
       * However, it will fail the unit test in a way that new duty is not displayed while it keep passing the e2e test.
       * I have no idea why it is not working in unit test.
       */}
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
            handleCreateDuty()
          }}
        >
          Add
        </Button>
      </div>
      <DutiesList
        duties={duties}
        onUpdateDuty={handleUpdateDuty}
        onCompleteDuty={handleCompleteDuty}
      />
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
