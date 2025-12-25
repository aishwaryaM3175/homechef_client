import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import { ThemeProvider } from "./context/ThemeContext.jsx"
import { SocketProvider } from "./context/SocketContext.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <SocketProvider>
          <Provider store={store}>
            <App />
          </Provider>
        </SocketProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
