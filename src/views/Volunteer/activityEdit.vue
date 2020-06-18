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
         label-width="100px"
         style="width:31.25rem;"
       >
       <el-form-item label="精彩回顾">
         <el-upload
           class="avatar-uploader"
           action="https://jsonplaceholder.typicode.com/posts/"
           :show-file-list="false"
           :on-success="handleAvatarSuccess"
           :before-upload="beforeAvatarUpload">
           <img v-if="imageUrl" :src="imageUrl" class="avatar">
           <i v-else class="el-icon-plus avatar-uploader-icon"></i>
         </el-upload>
         </el-form-item>
         <el-form-item
           label="活动名"
           prop="name"
         >
           <el-input
             v-model="activity.name"
             autocomplete="off"
           />
         </el-form-item>
         <el-form-item
           label="活动时间"
           prop="date"
         >
         <el-date-picker
               v-model="activity.date"
               type="daterange"
               range-separator="至"
               start-placeholder="开始日期"
               end-placeholder="结束日期">
         </el-date-picker>
         </el-form-item>
         <el-form-item
           label="活动地址"
           prop="address"
         >
         <el-input
           v-model="activity.address"
           autocomplete="off"
         />
         </el-form-item>
         <el-form-item
           label="报名用户"
           prop="<signUser></signUser>"
         >
         <el-input
           v-model="activity.signUser"
           autocomplete="off"
         />
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
      imageUrl:'',
      defaultactivity:{},
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
      this.$emit('update', true)
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
