import React, { useState, useEffect } from 'react'
import Calendar from './components/Calendar'
import EventForm from './components/EventForm'
import EventModal from './components/EventModal'
import { supabase } from './supabaseClient'
import './styles.css'

function App() {
  const [events, setEvents] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null)

  // Загрузка событий из Supabase
  useEffect(() => {
    fetchEvents()
    
    const subscription = supabase
      .channel('events-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'events' },
        () => {
          fetchEvents()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchEvents = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
      
      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Ошибка загрузки событий:', error)
      showNiceAlert('Ошибка загрузки событий', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Клик по дате в календаре (выбор для формы)
  const handleDateClick = (date) => {
    console.log('Выбрана дата для формы:', date)
    setSelectedDate(date)
    setSelectedCalendarDate(date)
    setSelectedEvent(null) // Сбрасываем выбранное событие
  }

  // Клик по сердечку (просмотр событий на этой дате)
  const handleEventClick = (date, eventsOnDate) => {
    console.log('Клик по сердечку на дату:', date)
    console.log('События на этой дате:', eventsOnDate)
    
    if (eventsOnDate && eventsOnDate.length > 0) {
      // Если несколько событий, покажем первое
      // Можно улучшить: показывать список если их несколько
      setSelectedEvent(eventsOnDate[0])
    }
  }

  const handleEventAdded = () => {
    fetchEvents()
    setSelectedDate(null)
    setSelectedCalendarDate(null)
    setSelectedEvent(null)
    showNiceAlert('Свидание добавлено! ❤️', 'success')
  }

  const handleDeleteEvent = async (eventId) => {
    // Красивое подтверждение удаления
    const userConfirmed = await showConfirmDialog(
      'Удалить свидание?',
      'Это действие нельзя отменить',
      'Удалить',
      'Отмена'
    )
    
    if (userConfirmed) {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
      
      if (!error) {
        fetchEvents()
        setSelectedEvent(null)
        setSelectedCalendarDate(null)
        showNiceAlert('Свидание удалено', 'info')
      }
    }
  }

  // Функция для красивого alert
  const showNiceAlert = (message, type = 'info') => {
    const alertDiv = document.createElement('div')
    alertDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      ">
        <div style="
          background: white;
          padding: 30px;
          border-radius: 15px;
          max-width: 400px;
          width: 90%;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          animation: popIn 0.3s ease;
        ">
          <div style="
            font-size: 3em;
            margin-bottom: 15px;
            color: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#ff4444' : '#2196F3'};
          ">
            ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
          </div>
          <h3 style="margin-bottom: 10px; color: #333;">${message}</h3>
          <button id="okBtn" style="
            margin-top: 20px;
            padding: 10px 30px;
            background: #ff6b93;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 1em;
          ">OK</button>
        </div>
      </div>
    `
    
    document.body.appendChild(alertDiv)
    
    return new Promise((resolve) => {
      alertDiv.querySelector('#okBtn').onclick = () => {
        document.body.removeChild(alertDiv)
        resolve()
      }
      
      // Автозакрытие через 2 секунды
      setTimeout(() => {
        if (document.body.contains(alertDiv)) {
          document.body.removeChild(alertDiv)
          resolve()
        }
      }, 2000)
    })
  }

  // Функция для красивого confirm
  const showConfirmDialog = (title, message, confirmText = 'Да', cancelText = 'Нет') => {
    const confirmDiv = document.createElement('div')
    confirmDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      ">
        <div style="
          background: white;
          padding: 30px;
          border-radius: 15px;
          max-width: 400px;
          width: 90%;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          animation: popIn 0.3s ease;
        ">
          <div style="
            font-size: 2.5em;
            margin-bottom: 15px;
            color: #ff6b93;
          ">
            ❤️
          </div>
          <h3 style="margin-bottom: 10px; color: #333;">${title}</h3>
          <p style="margin-bottom: 25px; color: #666;">${message}</p>
          <div style="display: flex; gap: 15px; justify-content: center;">
            <button id="cancelBtn" style="
              padding: 10px 25px;
              background: #f0f0f0;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-weight: 600;
              flex: 1;
            ">${cancelText}</button>
            <button id="confirmBtn" style="
              padding: 10px 25px;
              background: #ff4444;
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-weight: 600;
              flex: 1;
            ">${confirmText}</button>
          </div>
        </div>
      </div>
    `
    
    document.body.appendChild(confirmDiv)
    
    return new Promise((resolve) => {
      confirmDiv.querySelector('#cancelBtn').onclick = () => {
        document.body.removeChild(confirmDiv)
        resolve(false)
      }
      
      confirmDiv.querySelector('#confirmBtn').onclick = () => {
        document.body.removeChild(confirmDiv)
        resolve(true)
      }
      
      // Закрытие по клику на оверлей
      confirmDiv.querySelector('div').onclick = (e) => {
        if (e.target === e.currentTarget) {
          document.body.removeChild(confirmDiv)
          resolve(false)
        }
      }
    })
  }

  const currentHour = new Date().getHours()
  let greeting = 'Добрый вечер'
  if (currentHour < 12) greeting = 'Доброе утро'
  else if (currentHour < 18) greeting = 'Добрый день'

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-heart">❤️</div>
        <h1>Привет, Диана!</h1>
        <p className="greeting">{greeting} • Наш календарь свиданий</p>
      </header>

      <main>
        <div className="content-wrapper">
          <div className="left-panel">
            <EventForm 
              selectedDate={selectedDate} 
              onEventAdded={handleEventAdded} 
            />
            
            <div className="stats-card">
              <h3>📊 Статистика месяца</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">{events.length}</span>
                  <span className="stat-label">свиданий</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {[...new Set(events.map(e => e.date))].length}
                  </span>
                  <span className="stat-label">дней</span>
                </div>
              </div>
            </div>

            <div className="instructions">
              <h3>💡 Как пользоваться</h3>
              <ul>
                <li><strong>Клик на дату</strong> - выбрать для добавления свидания</li>
                <li><strong>Клик на сердечко ❤️</strong> - посмотреть событие</li>
                <li><strong>Можно добавлять</strong> несколько свиданий на один день</li>
                <li>Все изменения видны всем сразу</li>
              </ul>
            </div>
          </div>

          <div className="right-panel">
            <Calendar 
              events={events} 
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
              isLoading={isLoading}
              selectedDate={selectedCalendarDate}
            />
          </div>
        </div>
      </main>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => {
            setSelectedEvent(null)
            setSelectedCalendarDate(null)
          }}
          onDelete={handleDeleteEvent}
        />
      )}

      <footer className="app-footer">
        <p>Сделано с ❤️ • Все свидания видны всем пользователям</p>
        <p className="footer-note">Обновляется в реальном времени</p>
      </footer>
    </div>
  )
}

export default App