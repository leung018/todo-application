import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { DutyRemoteServiceImpl } from './services/duty'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
const dutyRemoteService = new DutyRemoteServiceImpl({
  apiEndpoint: 'http://localhost:3001',
}) // TODO: Pass real API URL
root.render(
  <React.StrictMode>
    <App dutyRemoteService={dutyRemoteService} />
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
