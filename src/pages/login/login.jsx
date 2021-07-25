import React, { Component } from 'react'
import { Form, Input, Button, message} from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import './login.css'
import logo from '../../assets/images/logo.png'
import { Redirect } from 'react-router-dom'


/**Login router component */
class Login extends Component {

    handleSubmit = (event) => {
        event.preventDefault()
        /*const form = this.props.form
        const values = form.getFieldsValue()
        console.log('handleSubmit()',values)*/
     
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
            // 校验成功--异步执行，不需要回调函数 =>(){}.then来执行
                const {username, password} = values
                try{
                    const response = await reqLogin(username,password)
                    console.log('Request success', response.data)
                    const result = response //{status:0, data: }
                    if(result.status === 0){
                        //login successfully
                        message.success('Login successfully!')
                        //save current user
                        const user = result.data
                        memoryUtils.user = user
                        storageUtils.saveUser(user)
                        //go to home page, do not need to use push() because we don't need to back to login page
                        this.props.history.replace('/')
                    }
                }catch(error){
                    console.log('request failed',error)
                }
            } else {
            // 校验失败
            console.log('validation failed')
            }
        })
    }

    /**自定义验证密码 */
    validator = (rule, value, callback) => {
        // console.log(rule, value)
        const length = value && value.length
        const pwdReg = /^[a-zA-Z0-9_]+$/
        if (!value) {
        // callback 如果不传参代表校验成功，如果传参代表校验失败，并且会提示错误
        callback('必须输入密码')
        } else if (length < 4) {
        callback('密码必须大于 4 位')
        } else if (length > 12) {
        callback('密码必须小于 12 位')
        } else if (!pwdReg.test(value)) {
        callback('密码必须是英文、数组或下划线组成')
        } else {
        callback() // 必须调用 callback
        }
    }

    render() {
        //get form object
        const {getFieldDecorator} = this.props.form

        //if already loged in, redirect to home page
        const user = memoryUtils.user
        if(user && user._id){
            return <Redirect to='/'/>
        }
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React Project: Management System for small business</h1>    
                </header>
                <section className="login-content">
                    <h2>Login</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {
                                //高阶函数
                                getFieldDecorator('username',{
                                    //声明式验证
                                    rules: [
                                        {required: true, whitespace:true, message:'Username cannot be empty'},
                                        {min: 4, message:'Username should have at least 4 characters'},
                                        {max: 12, message:'Username should have no more than 12 characters'},
                                        {pattern: /^[a-zA-Z0-9_]+$/,message:'Username must contains characters, digits and special characters'}
                                    ]
                                })(
                                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                                )
                            }
                        </Form.Item>

                        <Form.Item>
                        {
                            //高阶函数 ('标识名称') 获取数据
                            getFieldDecorator('password',{
                                 //自定义验证
                                 rules: [
                                     {
                                         validator: this.validatePwd
                                     }
                                 ]
                            })(
                                <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password"/>
                            )
                        }               
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">Login</Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}
export default Form.create()(Login)
