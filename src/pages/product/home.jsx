import React, { Component } from 'react'
import { Card,Select,Input, Button, Table } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateProductStatus } from '../../api'
import { message } from 'antd'


const Option = Select.Option

export default class ProductHome extends Component {

    state = {
        products:[],
        total:0,
        loading:false,
        searchName: '', //keyword
        searchType:'productName'

    }

    updateProductStatus = async (productId, status) => {
        const result = await reqUpdateProductStatus(productId, status)
        if (result.status === 0) {
        message.success('更新状态成功!')
        this.getProducts(this.pageNum || 1)
        }
    }

     //init table column arrays
     initColumns = () => {
        this.columns = [
            {
              title: 'Product Name',
              dataIndex: 'name',
            },
            {
              title: 'Product Description',
              dataIndex: 'desc'
            },
            {
                title: 'Price',
                dataIndex: 'price',
                render: (price) => '$' + price
            },
            {
                width:100,
                title: 'Status',
                dataIndex: 'status',
                render: (status,product) => {

                    let btnText = 'Out of Stock'
                    let statusText = 'In Stock'

                    if(status === 2){
                        btnText = 'Back to sale'
                        statusText = 'Out of Stock'
                    }
                    status = status === 1?2:1
                    return (
                        <span>
                            <Button type='primary' onClick={() => {this.updateProductStatus(product._id,status)}}>{btnText}</Button>
                            <span>{statusText}</span>
                        </span>
                    )
                }
            },
            {
                title: 'Operations',
                width:300,
                render:(product) => (
                    <span>
                        <LinkButton onClick={() => this.props.history.push('/product/detail',{product})}>Detail</LinkButton>
                            &nbsp;&nbsp;&nbsp;
                        <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>Edit</LinkButton>
                    </span>
                )
            }
           
          ];
    }

    //get exact page's product
    getProducts =async (pageNum) => {
        this.setState({loading:true})
        const {searchName,searchType} = this.state
        let result
        //如果有值，则进行搜索分页
        if(searchName){
             result = await reqSearchProducts({pageNum, pageSize:3, searchName,searchType})
        }else {
             result = await reqProducts(pageNum, 3)
        }
        
        this.setState({loading:false})
        if(result.status === 0){
            const {total, list} = result.data
            this.setState({
                total,
                products:list
            })
        } 
    }


    componentWillMount() {
        this.initColumns()
    }

    componentDidMount(){
        this.getProducts(1)
    }

    render() {

        const {products, total,searchType,searchName} = this.state
        const title = (
            <span>
                <Select value={searchType} style={{width:150}} 
                        onChange={value => this.setState({searchType:value})}>
                    <Option value='productName'>Search by Name</Option>
                    <Option value='productDesc'>Search by Description</Option>
                </Select>
                <Input 
                    placeholder='Keyword' 
                    style={{width:150, margin:'0 15px'}} 
                    value={searchName} 
                    onChange={event => this.setState({searchName:event.target.value})}/>
                <Button type='primary' onClick={() => {this.getProducts(1)}}>Search</Button>
            </span>
        )

        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('./product/addupdate')}>
                <PlusOutlined />Add Product  
            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table 
                    bordered
                    rowKey='_id'
                    columns={this.columns} 
                    dataSource={products}
                    pagination={{
                        current: this.pageNum,
                        defaultPageSize:3, 
                        showQuickJumper:true, 
                        total,
                        onChange: this.getProducts
                    }}>

                </Table>
            </Card>
        )
    }
}
