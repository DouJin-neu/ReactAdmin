import React, { Component } from 'react'
import { Card, Table, Button, Modal, message } from 'antd';
import { reqRoles,reqAddRole, reqUpdateRole } from '../../api';
import AddForm from './add-form';
import AuthForm from'./auth-form';
import memoryUtils from '../../utils/memoryUtils';
import {formateDate} from '../../utils/dateUtils'
import storageUtils from '../../utils/storageUtils';

export default class Role extends Component {

    state = {
        roles:[],
        role:{}, //选中的role
        isShowAdd:false,
        isShowAuth:false

    }

    constructor (props) {
        super(props)
    
        this.auth = React.createRef()
    }

    initColumn = () => {
        this.columns = [
            {
                title: 'Role Name',
                dataIndex:'name'
            },
            {
                title: 'Create Time',
                dataIndex:'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title: 'Auth Time',
                dataIndex:'auth_time',
                render: formateDate
            },
            {
                title: 'Auth Name',
                dataIndex:'auth_name'
            },

        ]
    }

    getRoles= async () => {
        const result = await reqRoles()
        if(result.status === 0){
            const roles = result.data
            this.setState({
                roles
            })
        }
    }

    onRow = (role) => {
        return {
            onClick: evnet => {
                this.setState({
                    role
                })
            }
        }
    }

    addRole = () => {
        this.form.validateFields(async (error,values) => {
            if(!error){
                this.setState({
                    isShowAdd:false
                })
                const {roleName} = values
                this.form.resetFields()

                const result = await reqAddRole(roleName)
                if(result.status===0){
                    message.success('Add a new role success!')
                    const role = result.data
                    this.setState(state => ({
                        roles: [...state.roles, role]
                      }))
                }else{
                    message.success('Failed to add a new role')
                }
            }
        })
    }

    updateRole = async () => {
        this.setState({
            isShowAuth:false
        })

        const role = this.state.role
        //得到最新的menu
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username

        //request for update
        const result = await reqUpdateRole(role)
        if(result.status===0){
             // 如果当前更新的是自己角色的权限, 强制退出
            if(role._id === memoryUtils.user.role_id){
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('Update current role authorization success')
            }else{
                message.success('Update role auth success')
                this.setState({
                    roles:[...this.state.roles]
                })
            }
        }
    }

    componentWillMount(){
        this.initColumn()
    }

    componentDidMount(){
        this.getRoles()
    }

    render() {

        const {roles, role, isShowAuth, isShowAdd} = this.state
    

        const title = (
            <span>
                <Button type='primary' onClick={() => this.setState({isShowAdd: true})}>Create Role</Button> &nbsp;&nbsp;
                <Button type='primary' disabled={!role._id} onClick={() => this.setState({isShowAuth: true})}>Set Authorization</Button>
            </span>
        )
        return (
            
            <Card title={title}>
                <Table
                    dataSource={roles} 
                    columns={this.columns} 
                    rowKey='_id'
                    bordered
                    pagination={{defaultPageSize:3}}
                    rowSelection={{
                        type:'radio', 
                        selectedRowKeys:[role._id],
                        onSelect:(role)=>{
                            this.setState({
                                role
                            })
                        }
                    
                    }}
                    onRow={this.onRow}
                    >

                </Table>
                <Modal 
                    title="Add Role"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({isShowAdd:false})
                        this.form.resetFields()
                    }}>
                    <AddForm
                        setForm={(form) => this.form = form}
                    />
                </Modal>

                <Modal
                    title="Set Auth"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({isShowAuth: false})
                    }}
                    >
                    <AuthForm ref={this.auth} role={role}/>
                </Modal>
            </Card>
        )
    }
}

