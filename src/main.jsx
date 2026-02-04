import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

// Показываем лоадер минимум 3 секунды
const minLoadingTime = 3000 // 3 секунды
const startTime = Date.now()

const hideLoader = () => {
  const elapsed = Date.now() - startTime
  const remaining = Math.max(0, minLoadingTime - elapsed)
  
  setTimeout(() => {
    const loader = document.getElementById('loading')
    if (loader) {
      loader.style.opacity = '0'
      setTimeout(() => {
        loader.style.display = 'none'
      }, 500)
    }
  }, remaining)
}

// Скрываем лоадер после загрузки и минимум через 3 секунды
window.addEventListener('load', hideLoader)

// На всякий случай, если страница уже загружена
if (document.readyState === 'complete') {
  hideLoader()
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)