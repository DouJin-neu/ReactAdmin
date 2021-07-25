import React, { Component } from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message
  } from 'antd'
  import {formateDate} from "../../utils/dateUtils"
  import LinkButton from "../../components/link-button/index"
  import {reqDeleteUser, reqUsers, reqAddOrUpdateUser} from "../../api/index";
  import UserForm from './user-form'

export default class User extends Component {

    state = {
        users:[],
        roles:[],
        isShow:false
    }

    initColumns = () =>{
        this.columns = [
            {
              title: 'Username',
              dataIndex: 'username'
            },
            {
              title: 'Email',
              dataIndex: 'email'
            },
      
            {
              title: 'Phone',
              dataIndex: 'phone'
            },
            {
              title: 'Create Time',
              dataIndex: 'create_time',
              render: formateDate
            },
            {
              title: 'Role',
              dataIndex: 'role_id',
              render: (role_id) => this.roleNames[role_id]
            },
            {
              title: 'Operations',
              render: (user) => (
                <span>
                  <LinkButton onClick={() => this.showUpdate(user)}>Edit</LinkButton>
                  <LinkButton onClick={() => this.deleteUser(user)}>Delete</LinkButton>
                </span>
              )
            },
          ]
    }
 /*
  根据role的数组, 生成包含所有角色名的对象(属性名用角色id值)
   */
    initRoleNames = (roles) =>{
        const roleNames = roles.reduce((pre,role) => {
            pre[role._id] = role.name
            return pre
        },{})
        this.roleNames = roleNames
    }
  /*
  显示添加界面
   */
    showAdd = () => {
        this.user = null
        this.setState({
            isShow:true
        })
    }

    /*
  显示修改界面
   */
    showUpdate = (user) => {
        this.user = user // 保存user
        this.setState({
        isShow: true
        })
    }

    deleteUser = (user) => {
        Modal.confirm({
            title: `Are you sure to delete ${user.username}?`,
            onOk: async()=>{
                const result = await reqDeleteUser(user._id)
                if(result.status === 0){
                    message.success('Delete user successfully!')
                    this.getUsers()
                }
            }
        })
    }

    addOrUpdateUser = async() => {
        this.setState({isShow:false})

        const user = this.form.getFieldsValue()
        this.form.resetFields()
        if(this.user){
            user._id = this.user._id
        }

        const result = await reqAddOrUpdateUser(user)
        if(result.status === 0){
            message.success(`${this.user ? 'Update' : 'Add'}user successfully!`)
            this.getUsers()
        }
    }

    getUsers = async () => {
        const result = await reqUsers()
        if(result.status===0){
            const {users,roles} = result.data
            this.initRoleNames(roles)
            this.setState({
                users,
                roles
            })
        }
    }

    componentWillMount(){
        this.initColumns()
    }

    componentDidMount(){
        this.getUsers()
    }

    render() {

        const {users,roles,isShow} = this.state
        const user = this.user || {}

        const title = <Button type='primary' onClick={this.showAdd}>Create User</Button>

        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={users}
                    columns={this.columns}
                    pagination={{defaultPageSize:2}}/>

                <Modal
                    title={user._id ? 'Edit User': 'Create User'}   
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={()=>{
                        this.form.resetFields()
                        this.setState({isShow:false})
                    }}>

                    <UserForm
                        setForm={form => this.form = form}
                        roles={roles}
                        user={user}
                    />
                </Modal>
            </Card>
        )
    }
}
