import React, { Component } from 'react'
import {Card,List} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import {BASE_IMG_URL} from '../../utils/constants'
import {reqCategory} from '../../api'

const Item = List.Item

export default class ProductDetail extends Component {

    state = {
        cName1: '', // 一级分类名
        cName2:''    
    }

    /*异步获取当前产品对应的分类名称*/
    getCategoryName = async () => {
        const {categoryId, pCategoryId} = this.props.location.state.product
        if (pCategoryId === '0') {
        // 获取一级分类名称
            const result = await reqCategory(categoryId)
            const cName1 = result.data.name
            this.setState({cName1})
        } else {
        // 获取一级分类名称
        /*const result1 = await reqCategory(pCategoryId)
        const cName1 = result1.data.name
        // 获取二级分类名称
        const result2 = await reqCategory(categoryId)
        const cName2 = result2.data.name
        this.setState({cName1, cName2})*/
        /*一次发多个请求, 等所有请求都返回后一起处理, 如果有一个请求出错了, 整个都会失败
        Promise.all([promise1, promise2]) 返回值一个 promise 对象, 异步成功返回的是
        [result1, result2]
        */
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            const result1 = results[0]
            const result2 = results[1]
            const cName1 = result1.data.name
            console.log(cName1)
            const cName2 = result2.data.name
            this.setState({cName1, cName2})
        }
    }
    
    
    componentDidMount() {

        this.getCategoryName()
    }
   

    render() {

        console.log(this.props.location.state.product)
        const {name,desc,price,detail,imgs} = this.props.location.state.product

        const {cName1,cName2} = this.state
        const imgStyle = {width: 150, height: 150, marginRight: 10, border: '1px solid black'}

        const title = (
            <span>
                <LinkButton>
                    <ArrowLeftOutlined 
                        style={{marginRight:15, fontSize:20}}
                        onClick={() => this.props.history.goBack()} />
                </LinkButton>
                &nbsp;&nbsp;
                <span>Product Detail</span>
            </span>
        )
        return (
            <Card title={title} className="product-detail">
                <List>
                    <Item>
                        <span className='left'>Product Name:</span>
                        <span className='right'>{name}</span>
                    </Item>
                    <Item>
                        <span className='left'>Product Description:</span>
                        <span className='right'>{desc}</span>
                    </Item>
                    <Item>
                        <span className='left'>Price:</span>
                        <span className='right'>{'$'+price}</span>
                    </Item>
                    <Item>
                        <span className='left'>Category:</span>
                        <span className='right'>{cName1 + (cName2 ? ' --> ' + cName2 : '')}</span>
                    </Item>
                    <Item>
                        <span className='left'>Image:</span>
                        <span className='right'>
                            {
                            imgs.map(img => (
                            <img src={BASE_IMG_URL + img} alt="img" key={img} style={imgStyle}/>
                            ))
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className='left'>Product Detail:</span>
                        <div dangerouslySetInnerHTML={{__html: detail}}></div>
                    </Item>
                </List>
            </Card>
        )
    }
}
