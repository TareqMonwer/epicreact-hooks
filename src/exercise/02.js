// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useStorageState(
  key,
  initialValue,
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [state, setState] = React.useState(() => {
    const localStorageState = window.localStorage.getItem(key) || initialValue
    if (localStorageState) return deserialize(localStorageState)
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  const prevKeyRef = React.useRef();

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, serialize, state])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useStorageState('name', initialName)
  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
