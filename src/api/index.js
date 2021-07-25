/*包含 n 个接口请求函数的模块
每个函数返回 promise
*/
import jsonp from 'jsonp'
import { message } from 'antd'
import ajax from './ajax'
// Login
// export dunction reqLogin(username,password){
//     return ajax('/login',{username, password},'POST')
// }
const BASE = ''

export const reqLogin = (username, password) => ajax(BASE+'/login', {username, password},'POST')

//add new user
export const reqAddUser = (user) => ajax(BASE+'/manage/user.add',user,'POST')

//get category info
export const reqCategories = (parentId) => ajax(BASE+'/manage/category/list',{parentId})

//add category
export const reqAddCategory = (categoryName, parentId) => ajax(BASE+'/manage/category/add',{categoryName, parentId},'POST')

//update category --传一个含有id和name的对象，通过解构获得参数
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE+'/manage/category/update',{categoryId, categoryName},'POST')

//get product list
export const reqProducts = (pageNum,pageSize) => ajax(BASE+'/manage/product/list', {pageNum,pageSize})

//搜索商品分页列表 searchType: 搜索类型 productName/productDesc
export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType}) => ajax(BASE+ '/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]:searchName
})

//获取商品分类信息
export const reqCategory = (categoryId) => ajax(BASE+'/manage/category/info', {categoryId})

// 对商品进行上架/下架处理
export const reqUpdateProductStatus = (productId, status) => ajax('/manage/product/updateStatus', { productId, status}, 'POST')

//Delete upload picture
export const reqDeleteImg = (name) => ajax('/manage/img/delete',{name},'POST')

//Add or update product
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/'+(product._id?'update':'add'), product,'POST')

//获取角色列表
export const reqRoles = () => ajax(BASE+'/manage/role/list')
// 添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName}, 'POST')
// 添加角色
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')

//获取用户列表
export const reqUsers = () => ajax(BASE+'/manage/user/list')
//Add or update user
export const reqAddOrUpdateUser = (user) => ajax(BASE+'/manage/user/'+(user._id? 'update':'add'),user,'POST')
//delete user
export const reqDeleteUser = (userId) => ajax(BASE+'/manage/user/delete',{userId},'POST')

//json request api to get weather info
export const reqWeather = () => {
    return new Promise((resolve,reject) => {
        const url=`https://restapi.amap.com/v3/weather/weatherInfo?key=e813059725f7508abbdd008aa64d4175&city=310115`
        jsonp(url,{param: 'callback'},(err,data) => {
            console.log('jsonp',err,data)
          if(!err && data.status === '1'){
             const temperature = data.lives[0].temperature
             const weather = data.lives[0].weather
             
             resolve({temperature,weather})
          }else{
            message.error('Get weather information failed')
         }
        })
    })   
}