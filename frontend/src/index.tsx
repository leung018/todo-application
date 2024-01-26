import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { DutyRemoteServiceImpl } from './services/duty'

const apiEndpoint =
  process.env.REACT_APP_API_ENDPOINT || 'http://localhost:3001'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
const dutyRemoteService = new DutyRemoteServiceImpl({
  apiEndpoint,
})
root.render(
  <React.StrictMode>
    <App dutyRemoteService={dutyRemoteService} />
  </React.StrictMode>,
)
