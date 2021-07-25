import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Tree
} from 'antd'
import menuList from '../../config/menuConfig'

const Item = Form.Item
const {TreeNode} = Tree

export default class AuthForm extends Component {

    static propTypes = {
        role: PropTypes.object
    }

    constructor(props){
        super(props)
        const {menus} = this.props.role
        this.state = {
            checkedKeys:menus
        }
    }

    getMenus = () => this.state.checkedKeys

    getTreeNodes = (menuList) => {
        return menuList.reduce((pre,item) => {
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children ? this.getTreeNodes(item.children) : null}
                </TreeNode>
            )
            return pre
        },[])
    }

    onCheck = checkedKeys => {
        console.log('onCheck',checkedKeys);
        this.setState({checkedKeys})
    }

    componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList)
    }
    // 根据新传入的role来更新checkedKeys状态
  /*
  当组件接收到新的属性时自动调用
   */
    componentWillReceiveProps(nextProps){
        console.log('componentWillReceiveProps',nextProps)
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys:menus
        })
    }

    render() {
        const {role} = this.props
        const {checkedKeys} = this.state
        const formItemLayout = {
            
            labelCol: { span: 4 },  // 左侧label的宽度
            wrapperCol: { span: 15 }, // 右侧包裹的宽度
        }

        return (

            <div>
                <Item label='Role Name' {...formItemLayout}>
                    <Input value={role.name} disabled/>
                </Item>
                <Tree 
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                    >
                    <TreeNode title="Platform Authorization" key="all">
                        {this.treeNodes}
                    </TreeNode>
                </Tree>
            </div>
        )
    }
}
