import React from 'react';
import { Upload, Modal, message } from 'antd';
import PropTypes from 'prop-types'
import { PlusOutlined } from '@ant-design/icons';
import {reqDeleteImg} from '../../api'
import {BASE_IMG_URL} from "../../utils/constants";

export default class PicturesWall extends React.Component {

    static propTypes = {
     imgs: PropTypes.array
    }
  state = {
    previewVisible: false, //big picture ?
    previewImage: '', //big picture url
    previewTitle: '',
    fileList: [
    ],
  };

  constructor (props) {
    super(props)

    let fileList = []

    // 如果传入了imgs属性
    const {imgs} = this.props
    if (imgs && imgs.length>0) {
      fileList = imgs.map((img, index) => ({
        uid: -index, // 每个file都有自己唯一的id
        name: img, // 图片文件名
        status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
        url: BASE_IMG_URL + img
      }))
    }

    // 初始化状态
    this.state = {
      previewVisible: false, // 标识是否显示大图预览Modal
      previewImage: '', // 大图的url
      fileList // 所有已上传图片的数组
    }
  }
    /*
  获取所有已上传图片文件名的数组
   */
  getImgs  = () => {
    return this.state.fileList.map(file => file.name)
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    console.log('handlePreview()', file)
    // 显示指定file对应的大图
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange =async ({ file, fileList }) => {
      console.log('handleChange()',file.status,file === fileList[fileList.length-1])
      if(file.status==='done'){
          const result = file.response
          console.log(result)
          if(result.status === 0){
            message.success('Upload successfully!')
            const {name, url} = result.data
            file = fileList[fileList.length-1]
            file.name = name
            file.url = url
        }else{
            message.error('Failed to upload picture')
        }
      }else if(file.status==='removed'){
          const result = await reqDeleteImg(file.name)
          if(result.status===0){
              message.success('Delete picture successfully!')
          }else{
              message.error('Failed to delete picture')
          }
      }
     

      this.setState({fileList})
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
           action="/manage/img/upload" /*上传图片的接口地址*/
           accept='image/*'  /*只接收图片格式*/
           name='image' /*请求参数名*/
           listType="picture-card"  /*卡片样式*/
           fileList={fileList}  /*所有已上传图片文件对象的数组*/
           onPreview={this.handlePreview}
           onChange={this.handleChange}>
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}
