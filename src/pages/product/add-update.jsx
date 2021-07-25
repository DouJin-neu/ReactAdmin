import React, { Component } from 'react'
import { Card,Form,Input, Button, Table, Cascader, Upload, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import { reqCategories, reqAddOrUpdateProduct } from '../../api'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'

const {Item} = Form //{括号内是需要解构的对象，名称和方法名称一致 Item = Form.Item}
const {TextArea} = Input

class ProductAddUpdate extends Component {

    state = {
        options: []
    }

    constructor(props){
        super(props)

        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    initOptions = async (categories) => {
        // 根据categorys生成options数组
        const options = categories.map(c => ({
          value: c._id,
          label: c.name,
          isLeaf: false, // 不是叶子
        }))
        console.log(options)
    
        // 如果是一个二级分类商品的更新
        const {isUpdate, product} = this
        const {pCategoryId} = product
        if(isUpdate && pCategoryId!=='0') {
          // 获取对应的二级分类列表
          const subCategories = await this.getCategories(pCategoryId)
          // 生成二级下拉列表的options
          const childOptions = subCategories.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: true
          }))
    
          // 找到当前商品对应的一级option对象
          const targetOption = options.find(option => option.value===pCategoryId)
    
          // 关联对应的一级option上
          targetOption.children = childOptions
        }
    
    
        // 更新options状态
        this.setState({
          options
        })
      }

      
    //异步获取一级/二级分类列表
    getCategories = async(parentId) => {
        const result = await reqCategories(parentId)
        if(result.status === 0){
            const categories = result.data
            console.log(categories)
            //如果是一级分类列表
            if(parentId==='0'){
                this.initOptions(categories)
            }else{
                return categories
            }
      
        }

    }
    /*
  用加载下一级列表的回调函数
   */
  loadData = async selectedOptions => {
        // 得到选择的option对象
        const targetOption = selectedOptions[0]
        // 显示loading
        targetOption.loading = true

        // 根据选中的分类, 请求获取二级分类列表
        const subCategories = await this.getCategories(targetOption.value)
        // 隐藏loading
        targetOption.loading = false
        // 二级分类数组有数据
        if (subCategories && subCategories.length>0) {
        // 生成一个二级列表的options
        const childOptions = subCategories.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: true
        }))
        // 关联到当前option上
        targetOption.children = childOptions
        } else { // 当前选中的分类没有二级分类
        targetOption.isLeaf = true
        }

        // 更新options状态
        this.setState({
        options: [...this.state.options],
        })
  }


   
    //验证价格的函数
    validatePrice = (rule,value,callback) => {
        if(value * 1 > 0){
            callback()
        }else{
            callback('Price must greater than 0')
        }
    }

    submit = () => {
        this.props.form.validateFields(async (error,value) => {
            if(!error){
                // 1. 收集数据, 并封装成product对象
                const {name,desc,price,categoryIds} = value
                console.log(categoryIds)
                console.log(price)
                let pCategoryId, categoryId
                if(categoryIds.length === 1){
                    pCategoryId='0'
                    categoryId = categoryIds[0]
                }else{
                    pCategoryId=categoryIds[0]
                    categoryId = categoryIds[1]
                }
                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()

                const product = {name,desc,price,imgs,detail,pCategoryId,categoryId}

                 // 如果是更新, 需要添加_id
                 if(this.isUpdate){
                     product._id = this.product._id
                 }

                  // 2. 调用接口请求函数去添加/更新
                const result = await reqAddOrUpdateProduct(product)
                
                // 3. 根据结果提示
                if (result.status===0) {
                    message.success(`${this.isUpdate ? 'Update' : 'Add'}product successfully!`)
                    this.props.history.goBack()
                } else {
                    message.error(`${this.isUpdate ? 'Update' : 'Add'}product failed!`)
                }


            }
        })
    }

    componentDidMount(){
        this.getCategories('0')
    }

    componentWillMount () {
        // 取出携带的state
        const product = this.props.location.state  // 如果是添加没值, 否则有值
        console.log(product)
        // 保存是否是更新的标识
        this.isUpdate = !!product
        // 保存商品(如果没有, 保存是{})
        this.product = product || {}
    }

    render() {

        const {isUpdate, product} = this
        const {pCategoryId, categoryId, imgs, detail} = product

        // 用来接收级联分类ID的数组
        const categoryIds = []

        if(isUpdate){
            //商品为一级分类
            if(pCategoryId ==='0'){
                categoryIds.push(categoryId)
            }else{
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }

        console.log(categoryIds)

         //指定Item布局的配置对象
         const formItemLayout = {
            labelCol:{span :3},
            wrapperCol: {span: 8}
        }

        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined style={{fontSize: '20px'}}/>
                </LinkButton>
                <span>{isUpdate ? 'Edit Product' : 'Add Product'}</span>
            </span>
        )
        
        const {getFieldDecorator} = this.props.form

       
       
        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label="Product Name: ">
                       { 
                            getFieldDecorator('name',{
                                initialValue: product.name,
                                rules: [
                                    {required: true, message: 'Product name cannot be empty!'}
                                ]
                            })(<Input placeholder='Please enter product name' />) 
                        }
                       
                    </Item>

                    <Item label="Description: ">
                       { 
                            getFieldDecorator('desc',{
                                initialValue: product.desc,
                                rules: [
                                    {required: true, message: 'Product description cannot be empty!'}
                                ]
                            })( <TextArea placeholder='Please enter product description' autoSize={{minRows:2, maxRows:6}} /> ) 
                        }
                    </Item>

                    <Item label="Price: ">
                       { 
                            getFieldDecorator('price',{
                                initialValue: product.price,
                                rules: [
                                    {required: true, message: 'Price cannot be empty!'},
                                    {validator: this.validatePrice}
                                ]
                            })( <Input type='number' addonBefore='$' placeholder='Please enter product price' /> ) 
                        }
                       
                    </Item>

                    <Item label="Category: ">
                        {
                        getFieldDecorator('categoryIds', {
                            initialValue: categoryIds,
                            rules: [
                            {required: true, message: 'Category cannot be empty!'},
                            ]
                        })(
                            <Cascader
                            placeholder='Please select product category'
                            options={this.state.options}  /*需要显示的列表数据数组*/
                            loadData={this.loadData} /*当选择某个列表项, 加载下一级列表的监听回调*/
                            />
                        )
                        }

                    </Item>
                    <Item label="Pictures: ">
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label="Details: " labelCol={{span:3}} wrapperCol={{span:20}}>
                        <RichTextEditor ref={this.editor} detail={detail}/>
                    </Item>
                    <Item>
                       <Button type='primary' onClick={this.submit}>Submit</Button> 
                    </Item>
                </Form>
            </Card>
        )
    }
}
export default Form.create()(ProductAddUpdate)
