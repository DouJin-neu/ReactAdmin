import React, { Component } from 'react'
import { Card, Table, Button, message, Modal } from 'antd';
import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button';
import {reqAddCategory, reqCategories, reqUpdateCategory} from '../../api'
import AddForm from './add-form';
import UpdateForm from './update-form';

export default class Category extends Component {

    state = {
        loading:false,
        categories: [], //first class categories
        subCategories:[],
        parentId:'0',
        parentName:'',
        showStatus:0, //标识添加/更新的确认框是否显示，0-不显示，1-显示添加，2-显示更新
    }

    //init table column arrays
    initColumns = () => {
        this.columns = [
            {
              title: 'Category Name',
              dataIndex: 'name',
            },
            {
              title: 'Operations',
              width:300,
              render:(category) => (
                  <span>
                      <LinkButton onClick={() => {this.showUpdateForm(category)}}>Edit</LinkButton>
                      {/*一级分类才有第二个button*/}
                      {this.state.parentId==='0' ? <LinkButton onClick={() => {this.showSubCategories(category)}}>Sub Categories</LinkButton> : null}
                      
                  </span>
              )
            },
           
          ];
    }

    //异步获取一级/二级分类列表
    getCategories = async () => {
        //before request, state is loading
        const parentId = this.state.parentId
        this.setState({loading:true})
       // reqCategories('0') 获取promise对象
       const result = await reqCategories(parentId)
        //after request, state is not loading
       this.setState({loading: false})
       if(result.status === 0){
            const categories = result.data
            if(parentId==='0'){//update first class category state
                this.setState({
                    categories
                })
            }else{
                this.setState({
                    subCategories:categories
                })
            }
            
           
       }else{
           message.error('Failed to access to catrgory list')
       }
    }

    //显示指定一级分类对象的二级分类列表
    showSubCategories = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name
        },() => { //在状态更新且重新render（）后执行
            console.log('parentId',this.state.parentId)
            //获取二级分类列表
            this.getCategories()
        })
       
    }
    //显示一级列表
    showCategories = () => {
        this.setState({
            parentId:'0',
            parentName: '',
            subCategories: []
        })
    }

    //响应点击取消对话框,隐藏对话框
    handleCancel = () => {
        //清除输入
        this.form.resetFields()

        this.setState({
            showStatus:0
        })
    }

    showAddForm = () => {
        this.setState({
            showStatus:1
        })
    }

    //add category
    addCategory =  () => {

        this.form.validateFields(async(err,values) => {
            if(!err){
                 //收集数据，提交添加请求，重新获取分类列表显示
                const {parentId,categoryName} = values
                console.log(parentId)
                console.log(categoryName)

                this.setState({
                    showStatus:0
                })
            
                //清除输入
                this.form.resetFields()

                const result = await reqAddCategory(categoryName,parentId)
                if(result.status === 0){
                    /*添加一级分类 在当前分类列表下添加*/
                    if( parentId===this.state.parentId) {
                        this.getCategories()
                    } else if (parentId === '0'){
                        this.getCategories(parentId)
                    }
                }
            }
        }) 
    }

    showUpdateForm = (category) => {
        // 保存分类对象
        this.category = category
        // 更新状态
        this.setState({
          showStatus: 2
        })
      }

    //update category
    updateCategory = () => {

        //form validation
        this.form.validateFields(async(err,values) => {
            if(!err){
                this.setState({
                    showStatus:0
                })
        
                //准备数据
                const categoryId = this.category._id
                const {categoryName} = values
                //const categoryName = this.form.getFieldValue('categoryName')
        
                //清除输入
                this.form.resetFields()
        
                //发送请求，保存更新分类
                const result = await reqUpdateCategory({categoryId,categoryName})
                if(result.status === 0){
                    //重新显示列表
                    this.getCategories()
                }
            }
        })

        
        
    }

    componentWillMount() {
        this.initColumns()
    }

    //执行异步任务 --获取一级分类列表
    componentDidMount() {
        this.getCategories()
    }
    
    render() {

        const {categories,loading, subCategories, parentId, parentName,showStatus} = this.state
        //读取指定分类
        const category = this.category || {}
        //card right side title
        
        const title = parentId === '0' ? 'First Class Category': (
            <span>
                <LinkButton onClick={this.showCategories}>First Class Category</LinkButton>
                <RightOutlined  style={{marginRight: '5px'}}/>
                <span>{parentName}</span>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={this.showAddForm}>
                <PlusOutlined />Add Category  
            </Button>
        )

     

        return (
            <Card title={title} extra={extra}>
                <Table 
                    dataSource={parentId==='0'?categories:subCategories} 
                    columns={this.columns} 
                    rowKey='_id'
                    bordered
                    pagination={{defaultPageSize:5,showQuickJumper:true}}
                    loading={loading}
                />
                <Modal title="Add Category" visible={showStatus===1} onOk={this.addCategory} onCancel={this.handleCancel}>
                    <AddForm
                        categories={categories}
                        parentId={parentId}
                        setForm={(form) => {this.form = form}}
                    />
                </Modal>

                <Modal title="Update Category" visible={showStatus===2} onOk={this.updateCategory} onCancel={this.handleCancel}>
                    <UpdateForm  
                        categoryName={category.name}
                        setForm={(form) => {this.form = form} }
                        />
                </Modal>
            </Card>
        )
    }
}
