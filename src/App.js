import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'
const getLocalStorage = () => {
  let list = localStorage.getItem('list')
  if (list) {
    return (list = JSON.parse(localStorage.getItem('list')))
  } else {
    return []
  }
}
function App() {
  const [name, setName] = useState('')
  const [list, setList] = useState(getLocalStorage())
  const [isEditing, setIsEditing] = useState(false)
  const [editID, setEditID] = useState(null)
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' })
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name) {
      showAlert(true, 'danger', 'please enter value')
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name }
          }
          return item
        })
      )
      setName('')
      setEditID(null)
      setIsEditing(false)
      showAlert(true, 'success', 'Value Changed')
    } else {
      showAlert(true, 'success', 'Item Added')
      const newItem = { id: new Date().getTime().toString(), title: name }
      setList([...list, newItem])
      setName('')
    }
  }
  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg })
  }
  const clearList = () => {
    showAlert(true, 'danger', 'empty list')
    setList([])
  }
  const removeItem = (id) => {
    showAlert(true, 'danger', 'Item Removed')
    setList(list.filter((item) => item.id !== id))
  }
  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id)
    setIsEditing(true)
    setEditID(id)
    setName(specificItem.title)
  }
  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list))
  }, [list])
  return (
    <section className='section-center'>
      <form onSubmit={handleSubmit} className='item-form'>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>Add Your Items</h3>
        <div className='form-control'>
          <input
            type='text'
            className='item'
            placeholder='E.g Homework'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type='submit' className='submit-btn'>
            {isEditing ? 'edit' : 'submit'}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className='item-container'>
          <List items={list} removeItem={removeItem} editItem={editItem}></List>
          <button className='clear-btn' onClick={clearList}>
            Clear Items
          </button>
        </div>
      )}
    </section>
  )
}

export default App
