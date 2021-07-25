import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input
} from 'antd'
const Item = Form.Item

class AddForm extends Component{
    static propTypes = {
        setForm : PropTypes.func.isRequired // 用来传递form对象的函数
    }

    componentWillMount(){
        this.props.setForm(this.props.form)
    }

    render() {
        const {getFieldDecorator} = this.props.form

        const formItemLayout = {
            
            labelCol: { span: 4 },  // 左侧label的宽度
            wrapperCol: { span: 15 }, // 右侧包裹的宽度
        }

        return (
            <Form>
                <Item label='Role Name' {...formItemLayout}>
                {
                    getFieldDecorator('roleName', {
                    initialValue: '',
                    rules: [
                        {required: true, message: 'Role name cannot be empty'}
                    ]
                    })(
                    <Input placeholder='Please enter role name'/>
                    )
                }
                </Item>
        </Form>
        )
    }
}

export default Form.create()(AddForm)