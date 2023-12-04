import { useState, useImperativeHandle, forwardRef } from 'react'


const Dropdown = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }


  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      {props.header}
      <button onClick={() => toggleVisibility()} id='dropdownToggler'>{visible ? 'hide' : 'view'}</button>
      <div style={showWhenVisible} id='dropdownContent'>
        {props.children}
      </div>
    </div>
  )

})

Dropdown.displayName = 'Dropdown'

export default Dropdown