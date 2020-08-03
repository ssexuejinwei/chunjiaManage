<template>
  <div class="activityEditInfo">
    <page-header title="活动详细信息" />
    <el-page-header @back="goBack" />
    <br>
    <br>
    <el-container style="width: 100%;">
        <el-main>
       <el-form
           :model="activity"
           label-width="120px"
           style="width:40rem;"
         >
           <el-form-item
             label="活动标题"
           >
             <el-input
               v-model="activity.title"
               autocomplete="off"
             />
           </el-form-item>
           <el-form-item
             label="发布人姓名"
           >
             <el-input
               v-model="activity.publisher"
               autocomplete="off"
             />
           </el-form-item>
           <el-form-item
             label="发布人联系方式"
           >
             <el-input
               v-model="activity.publisher_contact"
               autocomplete="off"
             />
           </el-form-item>
           <el-form-item
             label="活动地点"
           >
             <el-input
               v-model="activity.address"
               autocomplete="off"
             />
           </el-form-item>
           <el-form-item
             label="活动详情"
           >
           <el-input type="textarea" autosize maxlength="100" v-model="activity.detail"> </el-input>
            <span>(100字以内)</span>
           </el-form-item>
           <el-form-item
             label="注意事项"
           >
            <el-input type="textarea" autosize maxlength="100" v-model="activity.notice"> </el-input>
              <span>(100字以内)</span>
           </el-form-item>
       <el-form-item
         label="活动时间"
       >
       <el-date-picker
             v-model="activity.activity_time"
             type="date"
             value-format="yyyy-MM-dd"
             placeholder="日期">
       </el-date-picker>
       </el-form-item>
       <el-form-item
         label="最大报名人数"
       >
         <el-input
           v-model="activity.max_number"
           autocomplete="off"
         />
       </el-form-item>
       <el-form-item
         label="当前报名人数"
       >
         <el-input
           v-model="activity.participant_number"
           autocomplete="off"
         />
       </el-form-item>
       <el-form-item label="精彩回顾">
         <el-upload
           action="#"
           ref="upload"
           list-type="picture-card"
           :file-list="fileList"
           :limit="1"
           :on-remove="handleRemove"
           :http-request="handleUpload"
           :on-success="handleUploadSuccess"
           :on-change="handleUploadChange"
           :auto-upload="true"
           >
           <i class="el-icon-plus"></i>
           <div slot="tip" class="el-upload__tip" style="font:bold;color: #FA7959;">只能上传单个jpg/png文件</div>
         </el-upload>
       </el-form-item>
         <el-form-item>
           <el-radio-group v-model="activity.status">
               <el-radio :label="0">可报名</el-radio>
               <el-radio :label="1">报名结束</el-radio>
             </el-radio-group>
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
      baseURL:'https://www.cjshequ.top:8000/',
      api:'/api/community/manage/activity/',
      api_upload:'/api/community/manage/activity/upload/',
      fileList:[],
      defaultactivity:{},
      dialogImageUrl:[],
      dialogVisible:false,
      images:[]
    }
  },
  created () {
    this.fileList.push({
      name: this.baseURL+this.activity.pic,
      url: this.baseURL+this.activity.pic,
    })
  },
  methods: {
    save () {
      //调API
      delete this.activity.pic
      Axios.put(this.api, qs.stringify({
        ...this.activity,
        type:0
      }))
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
      formData.append('image', file)
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
    },
    handleUploadChange (file, fileList) {
      this.dialogImageUrl.push(file.raw);
    }
  }
}
</script>

<style lang="scss">
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
