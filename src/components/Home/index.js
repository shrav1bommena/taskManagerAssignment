import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiOutlinePlus} from 'react-icons/ai'
import {BsFillBellFill, BsCheck} from 'react-icons/bs'
import {RiPencilFill} from 'react-icons/ri'
import SideBar from '../SideBar'
import TopBar from '../TopBar'

import './index.css'
import TaskForm from '../TaskForm'

// 1.1 Adding Task

//     URL : https://stage.api.sloovi.com/task/lead_65b171d46f3945549e3baa997e3fc4c2?company_id=<company_id>
//     Method : POST
//     Headers : {
//                 'Authorization': 'Bearer ' + <access_token from login step>,
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//               }
//     Body :    {
//                 assigned_user:  <id value from /team api response >,
//                 task_date: <date in 'YYYY-MM-DD' format from date field in task>,
//                 task_time: <time from time field in task>,seconds in integer format(for ex=01:30am means 5400 seconds) ,
//                 is_completed:<0 or 1 integer data type>,
// 		time_zone:< Currenttimezone value in seconds and data type is integer>,(for ex= +05:30 means 19800 seconds),
//                 task_msg: <task description from task description field in task>
//                }

class Home extends Component {
  state = {
    taskTitle: '',
    userId: '',
    companyId: '',
    icon: '',
    tasksList: [],
    addTask: false,
  }

  componentDidMount() {
    this.getUserCodes()
  }

  // to get all task after initial API call
  // results[0].task_msg, .task_time, time_zone,task_date,task_date_time_in_utc
  // task_date_time_in_utc_string,
  getAllTaskList = async () => {
    const {companyId} = this.state
    const jwtToken = Cookies.get('jwtToken')
    const url = `https://stage.api.sloovi.com/task/lead_65b171d46f3945549e3baa997e3fc4c2?company_id=${companyId}`
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
      console.log('All task')
      const {results} = data
      const tasksList = results.map(eachTask => ({
        id: eachTask.id,
        assignedUser: eachTask.assigned_user,
        taskDate: eachTask.task_date,
        taskTime: eachTask.task_time,
        isCompleted: eachTask.is_completed,
        taskMsg: eachTask.task_msg,
      }))
      this.setState({tasksList})
    }
  }

  // initial API to get userID, companyID, icon
  getUserCodes = async () => {
    const url = 'https://stage.api.sloovi.com/login?product=outreach'
    const userDetails = {
      email: 'smithwills1989@gmail.com',
      password: '12345678',
    }
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const {results} = data
      Cookies.set('jwtToken', results.token, {expires: 30})
      this.setState(
        {
          userId: results.user_id,
          companyId: results.company_id,
          icon: results.icon,
        },
        this.getAllTaskList,
      )
    }
  }

  // checking how to add date before moving the
  // date to different component
  onClickAddTaskButton = () => {
    this.setState({addTask: true})
  }

  onClickTaskCancelButton = () => {
    this.setState({addTask: false})
  }

  renderTaskAddSection = () => {
    const {tasksList} = this.state
    const count = tasksList.length

    return (
      <div className="task-add-section">
        <p className="task-add-section-title">
          TASKS{' '}
          <span id="taskCount" className="task-add-section-task-count">
            {count}
          </span>
        </p>
        <button
          onClick={this.onClickAddTaskButton}
          className="task-add-section-button"
          type="button"
        >
          <AiOutlinePlus className="task-add-section-icon" />
        </button>
      </div>
    )
  }

  renderAllTaskSection = () => {
    const {tasksList} = this.state

    return (
      <ul className="tasks-list">
        {tasksList.map(eachTask => (
          <li className="task-item" key={eachTask.id}>
            <div className="task-item-icon">{}</div>
            <div className="task-item-details">
              <p className="task-item-msg">{eachTask.taskMsg}</p>
              <p className="task-item-date">{eachTask.taskDate}</p>
            </div>
            <div>
              <button className="task-item-button" type="button">
                <RiPencilFill />
              </button>
              <button className="task-item-button" type="button">
                <BsFillBellFill />
              </button>
              <button className="task-item-button" type="button">
                <BsCheck />
              </button>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  render() {
    const {companyId, addTask} = this.state

    return (
      <div className="main-container">
        <SideBar />
        <div className="right-section">
          <TopBar />
          <div className="task-section">
            <h1 className="task-section-heading">Test</h1>
            <a href="https://sloovi.com" target="_blank" rel="noreferrer">
              Sloovi.com
            </a>
            <p className="task-section-description">Add description,</p>
            <div>
              {this.renderTaskAddSection()}
              {addTask ? (
                <TaskForm
                  onClickTaskCancelButton={this.onClickTaskCancelButton}
                  companyId={companyId}
                />
              ) : (
                this.renderAllTaskSection()
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
