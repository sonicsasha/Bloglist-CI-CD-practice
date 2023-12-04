import PropTypes from 'prop-types'

const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }
  return (
    <div className={notification.type}>
      {notification.message}
    </div>
  )
}

Notification.propTypes = {
  notification: PropTypes.object.isRequired
}

export default Notification