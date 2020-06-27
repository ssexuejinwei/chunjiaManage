<template>
  <div class="volunteerEditInfo">
    <page-header title="活动详细信息" />
    <el-page-header @back="goBack" />
    <br>
    <br>
    <el-container style="width: 100%;">
        <el-main>
       <el-form
         :model="volunteer"
         label-width="100px"
         style="width:31.25rem;"
       >
       <el-form
           :model="volunteer"
           label-width="100px"
           style="width:31.25rem;"
         >
           <el-form-item
             label="活动标题"
           >
             <el-input
               v-model="volunteer.title"
               autocomplete="off"
             />
           </el-form-item>
           <el-form-item
             label="发布人姓名"
           >
             <el-input
               v-model="volunteer.publisher"
               autocomplete="off"
             />
           </el-form-item>
           <el-form-item
             label="发布人联系方式"
           >
             <el-input
               v-model="volunteer.publisher_contact"
               autocomplete="off"
             />
           </el-form-item>
           <el-form-item
             label="活动地点"
           >
             <el-input
               v-model="volunteer.address"
               autocomplete="off"
             />
           </el-form-item>
           <el-form-item
             label="活动详情"
           >
             <el-input
               v-model="volunteer.detail"
               autocomplete="off"
             />
           </el-form-item>
           <el-form-item
             label="注意事项"
           >
             <el-input
               v-model="volunteer.notice"
               autocomplete="off"
             />
           </el-form-item>
       <el-form-item
         label="活动时间"
       >
           <el-date-picker
                v-model="volunteer.volunteer_time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
          </el-date-picker>
       </el-form-item>
       <el-form-item
         label="最大报名人数"
       >
         <el-input
           v-model="volunteer.max_number"
           autocomplete="off"
         />
       </el-form-item>
       <el-form-item
         label="当前报名人数"
       >
         <el-input
           v-model="volunteer.participant_number"
           autocomplete="off"
         />
       </el-form-item>
       <el-form-item
         label="精彩回顾"
       >
         <el-upload
           class="upload-demo"
           action="#"
           :on-preview="handlePreview"
           :on-remove="handleRemove"
           :file-list="fileList"
           list-type="picture">
           <el-button size="small" type="primary">点击上传</el-button>
         </el-upload>
       </el-form-item>
         <el-form-item>
           <el-radio-group v-model="volunteer.status">
               <el-radio :label="0">可报名</el-radio>
               <el-radio :label="1">报名结束</el-radio>
             </el-radio-group>
         </el-form-item>
       </el-form>
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
    volunteer: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      imageUrl:'',
      defaultvolunteer:{},
    }
  },
  created () {
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
    const isJPG = file.type === 'image/jpeg';
    const isLt2M = file.size / 1024 / 1024 < 2;
    },
    save () {
      //调API
      Axios.post('/sellerctr/addvolunteer', qs.stringify({
        ...this.volunteer,
        type:1
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
