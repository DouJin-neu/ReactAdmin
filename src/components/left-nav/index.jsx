import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom' //不是路由组件，想获取location属性，使用withRouter
import { Menu } from 'antd';
import menuList from '../../config/menuConfig'
import './index.css'
import logo from '../../assets/images/logo.png'
import memoryUtils from "../../utils/memoryUtils";
const SubMenu = Menu.SubMenu

/**Left navigator */
class LeftNav extends Component {

    /*
  判断当前登陆用户对item是否有权限
   */
    hasAuth = (item) => {
        const {key,isPublic} = item

        const menus = memoryUtils.user.role.menus
        const username = memoryUtils.user.username

        if(username === 'admin' || isPublic || menus.indexOf(key)!==-1){
            return true
        }else if(item.children){
            return !!item.children.find(child => menus.indexOf(child.key)!==-1)
        }
        return false;
    }
    //根据menu的数据数组生成对应的标签数组， 使用map（） + 递归调用
    /*getMenuNodes = (menuList) => {
        return menuList.map(item => {
            if(!item.children){
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            {item.icon}
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            }else{
                return (
                    <SubMenu 
                        key={item.key}
                        icon = {item.icon} 
                        title={
                            <span>
                                {item.icon}
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }*/

    //根据menu的数据数组生成对应的标签数组， 使用reduce（） + 递归调用
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname

        return menuList.reduce((pre, item) => {
            if(this.hasAuth(item)){
                 //向pre中添加<Menu.Item> or <SubMenu>
                if(!item.children){
                    pre.push(
                        (
                        <Menu.Item key={item.key}>
                            <Link to={item.key}>
                                {item.icon}
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                        )
                    )
                }else{

                    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                    //如果存在，说明当前item的子列表需要展开
                    if(cItem){
                        this.openKey = item.key
                    }
                    
                    pre.push((
                        <SubMenu 
                            key={item.key}
                            icon = {item.icon} 
                            title={
                                <span>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </span>
                            }
                        >
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    ))
                }
            }
           
            return pre
        },[])
    }
    //在第一次render（）之前执行一次
    componentWillMount(){
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {
       
        let path = this.props.location.pathname
        //得到当前需要打开的列表
        console.log(path.indexOf('/product'))
        if(path.indexOf('/product') === 0){
            path = '/product'
        }
        const openKey = this.openKey
        return (
            <div className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={logo} alt = "logo"/>
                    <h1>Management System</h1>
                </Link>
                <Menu 
                    mode="inline" 
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}>
                    {
                        this.menuNodes
                    } 
                </Menu>
                
            </div>
            
        )
    }
}
/**
 * withRouter 高阶组件
 * 包装非路由组件，返回一个新的组件，使其能获取路由组件的3个属性：history/location/match
 */
export default withRouter(LeftNav)
