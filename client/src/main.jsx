import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { Provider } from 'react-redux'
import { Tooltip } from 'react-tooltip'
import store from './store/store.js'
import { router } from './routes/router'
import AppContextProviders from './contexts/AppContextProviders'
import AppInitializer from './AppInitializer.jsx'

import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AppInitializer>
        <RouterProvider router={router} />
      </AppInitializer>
    </Provider>
  </StrictMode>,
)
