import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppContextProvider } from './context/AppContext.jsx'
import { UGFProvider } from '@tychilabs/react-ugf'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UGFProvider mode="testnet">
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </UGFProvider>
  </StrictMode>,
)
