<template>
  <div class="activityEditInfo">
    <page-header title="党员活动详细信息" />
    <el-page-header @back="goBack" />
    <br>
    <br>
    <el-container style="width: 100%;">
        <el-main>
        <el-form
          ref="form"
          class="form"
          :model="activity"
          label-width="100px"
          style="width:31.25rem;"
        >
          <el-form-item label="活动名">
            <el-input v-model="activity.name" />
          </el-form-item>
          <el-form-item
            label="活动日期"
            prop="activity_time"
          >
            <el-date-picker
              v-model="activity.activity_time"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              style="width: 100%;"
            />
        </el-form-item>
          <el-form-item label="活动内容">
            <el-input v-model="activity.content" />
          </el-form-item>

          <el-form-item label="上传活动图片">
            <el-upload
              action="#"
              ref="upload"
              list-type="picture-card"
              :file-list="fileList"
              :on-remove="handleRemove"
              :on-change="handleChange"
              :auto-upload="false"
              >
               <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item size="large">
            <el-button @click="save" type="success">
              保存
            </el-button>
          </el-form-item>
        </el-form>
        </el-main>
    </el-container>
  </div>
</template>

<script>
import Axios from 'axios'
import qs from 'qs'
import VDistpicker from 'v-distpicker'
export default {
  components: {
    VDistpicker
  },
  props: {
    activity: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      baseURL:'http://47.101.181.233:8000',
      api:'/api/community/manage/party_activity/',
      api_upload:'/api/community/manage/party_activity/upload/',
      fileList:[],
      defaultactivity:{},
      dialogVisible:false,
      images:[],
      ruleForm: {
        coverUrl: "",
        coverFile: ""
      },
      file:{}
    }
  },
  created () {
    this.activity.images.forEach((value,index) => {
      console.log(this.file)
      this.fileList.push({
        name: this.baseURL+value,
        url: this.baseURL+value,
      })
    })
    
  },
  methods: {
    //url2img
    handleChange(file, fileList) {
      // this.images = fileList
      // console.log(this.images)
      this.images.push(file.raw)
    },
    save () {
      //调API
      let formData = new FormData()
      this.images.forEach((value,index) =>{
        console.log(value.raw)
        formData.append('images',value.raw)
      })
      
      formData.append('id',this.activity.id)
      Axios.post(this.api_upload,formData).then(response =>{
        console.log(response)
      })
      // this.activity.images = this.dialogImageUrl
      Axios.put(this.api, qs.stringify(this.activity))
        .then(() => {
          this.$alert('保存成功', '成功').then(() => {
            this.$emit('update', true)
          })
        }).catch(e => {
          console.error(e)
          this.$alert(`错误原因: ${e.message || '未知错误'}`, '添加失败')
        })
    },
    goBack() {
      this.$emit('back', false)
    },
    handleRemove(file, fileList) {
      this.dialogImageUrl.forEach((value,index) => {
        if(value == file.url) {
          this.dialogImageUrl.splice(index,1)
        }
      })
    },
    handleUpload (params) {
      const file = params.file
      const formData = new FormData()
      formData.append('images', file)
      formData.append('id', this.activity.id)
      console.log(formData)
      return Axios.post(this.api_upload, formData, {
        onUploadProgress: params.onProgress
      })
    },
    submitUpload (){
      this.$refs.upload.submit();
    },
    handleUploadSuccess (res, rawFile) {
      if (res?.data?.data?.fileName) {
        rawFile.url = process.env.VUE_APP_UPLOAD_PUBLIC_URL + res?.data?.data?.fileName
      }
    }
  }
}
</script>

<style lang="scss">
  .image {
      width: 100%;
      display: block;
    }
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
