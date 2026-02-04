import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

// Вспомогательная функция для форматирования даты
const formatDateForInput = (dateStr) => {
  if (!dateStr) return ''
  // dateStr в формате YYYY-MM-DD, input type="date" ожидает такой же формат
  return dateStr
}

const EventForm = ({ selectedDate, onEventAdded }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    date: formatDateForInput(selectedDate) || new Date().toISOString().split('T')[0],
    time: '19:00',
    duration: 120,
    description: '',
    image_url: ''
  })

  useEffect(() => {
    if (selectedDate) {
      console.log('EventForm: получена новая дата', selectedDate)
      setFormData(prev => ({ 
        ...prev, 
        date: formatDateForInput(selectedDate)
      }))
    }
  }, [selectedDate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    console.log('Отправляем данные:', formData)

    try {
      const { error } = await supabase
        .from('events')
        .insert([formData])

      if (error) throw error

      setFormData({
        date: new Date().toISOString().split('T')[0],
        time: '19:00',
        duration: 120,
        description: '',
        image_url: ''
      })

      onEventAdded()

    } catch (error) {
      console.error('Ошибка:', error)
      alert('Ошибка при добавлении свидания')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) || 0 : value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="event-form">
      <h2>📅 Добавить новое свидание</h2>
      
      <div className="form-group">
        <label htmlFor="date">Дата:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="time">Время:</label>
        <input
          type="time"
          id="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="duration">
          Длительность (минут): <span>{formData.duration} мин</span>
        </label>
        <input
          type="range"
          id="duration"
          name="duration"
          min="30"
          max="300"
          step="30"
          value={formData.duration}
          onChange={handleChange}
        />
        <div className="duration-hints">
          <span>30 мин</span>
          <span>2 часа</span>
          <span>5 часов</span>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Описание:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Куда пойдем? Что будем делать?"
          required
          rows="3"
        />
      </div>

      <div className="form-group">
        <label htmlFor="image_url">URL картинки (необязательно):</label>
        <input
          type="url"
          id="image_url"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <button 
        type="submit" 
        className="submit-btn"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Добавляем...' : 'Добавить свидание ❤️'}
      </button>
    </form>
  )
}

export default EventForm