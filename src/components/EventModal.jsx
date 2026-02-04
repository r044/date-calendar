import React from 'react'

const EventModal = ({ event, onClose, onDelete }) => {
  if (!event) return null

  const formatTime = (time) => {
    if (!time) return ''
    return time.slice(0, 5)
  }

  const getDurationText = (minutes) => {
    if (!minutes) return ''
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    
    if (hours === 0) return `${mins} мин`
    if (mins === 0) return `${hours} час`
    return `${hours} час ${mins} мин`
  }

  // Обработчик клика по оверлею
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>❤️ Свидание</h2>
          <div className="event-date">
            {new Date(event.date + 'T12:00:00').toLocaleDateString('ru-RU', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        <div className="event-details">
          <div className="detail-row">
            <span className="detail-label">⏰ Время:</span>
            <span className="detail-value">
              {formatTime(event.time)}
              {event.duration && ` (${getDurationText(event.duration)})`}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">📝 Описание:</span>
            <div className="detail-value description-text">
              {event.description}
            </div>
          </div>

          {event.image_url && (
            <div className="detail-row">
              <span className="detail-label">🖼️ Картинка:</span>
              <div className="event-image">
                <img 
                  src={event.image_url} 
                  alt="Свидание" 
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.parentNode.innerHTML += '<div class="image-fallback">Изображение не загрузилось</div>'
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button 
            className="delete-btn"
            onClick={() => onDelete(event.id)}
          >
            Удалить свидание
          </button>
          <button 
            className="close-btn"
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventModal