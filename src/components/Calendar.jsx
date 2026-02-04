import React, { useState } from 'react'

const Calendar = ({ events = [], onDateClick = () => {}, onEventClick = () => {}, isLoading = false, selectedDate = null }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ]
  
  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  const formatDate = (date) => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getTodayDate = () => {
    const today = new Date()
    return formatDate(today)
  }

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    const days = []
    
    let firstDayOfWeek = firstDay.getDay()
    if (firstDayOfWeek === 0) firstDayOfWeek = 6
    else firstDayOfWeek--
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const getEventsForDate = (date) => {
    const dateStr = formatDate(date)
    return events.filter(event => event.date === dateStr)
  }

  const hasEvent = (date) => {
    return getEventsForDate(date).length > 0
  }

  const changeMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const isSelectedDate = (date) => {
    return formatDate(date) === selectedDate
  }

  const isToday = (date) => {
    return formatDate(date) === getTodayDate()
  }

  if (isLoading) {
    return (
      <div className="calendar-loading">
        <div className="loader"></div>
        <p>Загружаем календарь...</p>
      </div>
    )
  }

  const days = getDaysInMonth()

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button 
          className="month-nav-btn"
          onClick={() => changeMonth(-1)}
        >
          ◀
        </button>
        
        <h2 className="current-month">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        
        <button 
          className="month-nav-btn"
          onClick={() => changeMonth(1)}
        >
          ▶
        </button>
      </div>

      <div className="weekdays">
        {daysOfWeek.map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="day empty"></div>
          }

          const dateStr = formatDate(date)
          const today = isToday(date)
          const dateEvents = getEventsForDate(date)
          const eventCount = dateEvents.length
          const selected = isSelectedDate(date)
          const hasEventFlag = hasEvent(date)

          return (
            <div 
              key={dateStr}
              className={`day ${today ? 'today' : ''} ${hasEventFlag ? 'has-event' : ''} ${selected ? 'selected' : ''}`}
              onClick={() => {
                console.log('Клик по дню:', dateStr)
                onDateClick(dateStr) // Выбираем дату для формы
              }}
              title={`${dateStr}${eventCount > 0 ? ` (${eventCount} событие${eventCount > 1 ? 'я' : ''})` : ''}`}
            >
              <div className="day-header">
                <span className="day-number">{date.getDate()}</span>
                {today && !selected && <span className="today-badge">●</span>}
              </div>
              
              {hasEventFlag && (
                <div className="day-events-container">
                  {/* Клик по сердечку - показывает события */}
                  <div 
                    className="day-events"
                    onClick={(e) => {
                      e.stopPropagation() // Останавливаем всплытие клика на день
                      console.log('Клик по сердечку для даты:', dateStr)
                      onEventClick(dateStr, dateEvents) // Передаем дату и все события
                    }}
                    title={`${eventCount} событие${eventCount > 1 ? 'я' : ''}. Кликните чтобы посмотреть`}
                  >
                    <span className="heart-icon">❤️</span>
                    {eventCount > 1 && (
                      <span className="event-count">{eventCount}</span>
                    )}
                  </div>
                  
                  {/* Подсказка что можно добавить еще */}
                  {selected && (
                    <div className="add-more-hint">
                      <small>Можно добавить ещё</small>
                    </div>
                  )}
                </div>
              )}
              
              {/* Если нет событий, но день выбран */}
              {!hasEventFlag && selected && (
                <div className="add-event-hint">
                  <small>Добавить событие</small>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar