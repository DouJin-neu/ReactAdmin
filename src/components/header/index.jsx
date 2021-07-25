import React, { Component } from 'react'
import { withRouter } from 'react-router'
import LinkButton from '../link-button'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { reqWeather } from '../../api'
import menuList from '../../config/menuConfig'
import './index.css'
import { Modal } from 'antd'

class Header extends Component {

    state = {
        currentTime: formateDate(Date.now()),
        temperature: '',
        weather: '',
    }

    getTime = () => {
        //每隔一秒获取当前时间，并更新状态数据currentTime
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }

    getWeather = async() => {
        const {temperature,weather} = await reqWeather()
        this.setState({temperature,weather})
    }

    getTitle = () => {
        //得到当前请求路径
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if(item.key === path){
                title = item.title
            }else if(item.children){
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                if(cItem){
                    title = cItem.title
                }
            }
        })
        return title
    }

    logout = () => {
        Modal.confirm({
            content: 'Are you sure to logout?',
            onOk: () => {
            console.log('OK')
            // 移除保存的 user
            storageUtils.removeUser()
            memoryUtils.user = {}
            // 跳转到 login
            this.props.history.replace('/login')
            },
            onCancel() {
            console.log('Cancel')
            },
        })
    }

    componentDidMount(){
        this.getTime()
        this.getWeather()
    }

    componentWillUnmount () {
        // 清除定时器
        clearInterval(this.intervalId)
    }

    render() {
        const {currentTime, temperature, weather} = this.state
        const username = memoryUtils.user.username
        const title = this.getTitle()
        return (
            <div className="header">
                <div className="header-top">
                    <span>Welcome, {username}</span>
                    <LinkButton onClick={this.logout}>Logout</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left"> {title} </div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <span>{temperature}℃</span>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)
