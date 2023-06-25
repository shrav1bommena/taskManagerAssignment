import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

// need to get details related to task from Home component
// If details came like it is related to particular task then need to
// it's details.
// Otherwise new empty task component that is ready to take input from user
// should be displayed.

// generating hours list

let hoursList = ['12:00am', '12:30am']

let hours = 1
let minutes = '00'

while (hours < 12) {
  let hoursText = hours
  if (hoursText < 10) {
    hoursText = `0${hours}`
  }
  const time = `${hoursText}:${minutes}am`
  hoursList.push(time)
  if (minutes === '00') {
    minutes = '30'
  } else {
    minutes = '00'
    hours += 1
  }
}

hoursList = [...hoursList, '12:00pm', '12:30pm']

hours = 1
minutes = '00'

while (hours < 12) {
  let hoursText = hours
  if (hoursText < 10) {
    hoursText = `0${hours}`
  }
  const time = `${hoursText}:${minutes}pm`
  hoursList.push(time)
  if (minutes === '00') {
    minutes = '30'
  } else {
    minutes = '00'
    hours += 1
  }
}

// console.log(hoursList)
const tempUserList = ['Ramu', 'Ajay']

class TaskForm extends Component {
  // eslint-disable-next-line react/destructuring-assignment
  state = {companyId: this.props.companyId}

  componentDidMount() {
    this.getAssignUserList()
  }

  getAssignUserList = async () => {
    const {companyId} = this.state
    console.log(this.props)
    console.log(companyId)
    const jwtToken = Cookies.get('jwtToken')
    const url = `https://stage.api.sloovi.com/team?product=outreach&company_id=${companyId}`
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      console.log('Assign Users list')
      console.log(data)
    }
  }

  renderTaskDescription = () => (
    <div className="input-container">
      <label htmlFor="description" className="form-label">
        Task Description
      </label>
      <input className="form-input" id="description" type="text" />
    </div>
  )

  renderTaskDate = () => (
    <div className="input-container date-time-flex">
      <label htmlFor="date" className="form-label">
        Date
      </label>
      <input className="form-input date-option" id="date" type="date" />
    </div>
  )

  // below should be selection element and need half-hourly list values
  renderTaskTime = () => (
    <div className="input-container date-time-flex">
      <label htmlFor="date" className="form-label">
        Time
      </label>
      <select className="time-options-list">
        {hoursList.map(eachHour => (
          <option key={eachHour} value={eachHour}>
            {eachHour}
          </option>
        ))}
      </select>
    </div>
  )

  renderAssignUser = () => (
    <div className="input-container">
      <label htmlFor="date" className="form-label">
        Assign User
      </label>
      <select className="time-options-list">
        {tempUserList.map(eachUser => (
          <option key={eachUser} value={eachUser}>
            {eachUser}
          </option>
        ))}
      </select>
    </div>
  )

  onSubmitTask = event => {
    event.preventDefault()
  }

  onCancelTask = () => {
    const {onClickTaskCancelButton} = this.props
    onClickTaskCancelButton()
  }

  render() {
    return (
      <form onSubmit={this.onSubmitTask} className="form-container">
        {this.renderTaskDescription()}
        <div className="date-time-container">
          {this.renderTaskDate()}
          {this.renderTaskTime()}
        </div>
        {this.renderAssignUser()}
        <div className="form-buttons-container">
          <button
            onClick={this.onCancelTask}
            className="form-button-cancel"
            type="button"
          >
            Cancel
          </button>
          <button className="form-button-save" type="submit">
            Save
          </button>
        </div>
      </form>
    )
  }
}

export default TaskForm
