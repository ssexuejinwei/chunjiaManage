<template>
  <div class="reportEditInfo">
    <page-header title="请您商量详细信息" />
    <el-page-header @back="goBack" />
    <br>
    <br>
    <el-container style="width: 100%;">
        <el-main>
        <el-form
          ref="form"
          class="form"
          :model="report"
          label-width="80px"
          style="width:31.25rem;"
        >
        <el-form-item label="图片">
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
          <el-form-item label="报事名称">
            <el-input v-model="report.name" />
          </el-form-item>
          <el-form-item label="报事类型">
            <el-radio-group v-model="report.type">
                <el-radio :label="1">群众报事</el-radio>
                <el-radio :label="2">企业报事</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item label="报事内容">
            <el-input v-model="report.content" />
          </el-form-item>
          <el-form-item label="案件定位">
            <el-input v-model="report.position" />
          </el-form-item>
          <el-form-item label="报给">
            <el-input v-model="report.grid" />
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="report.IDNumber" />
          </el-form-item>
          <el-form-item label="报事状态">
            <el-radio-group v-model="report.status">
                <el-radio :label="1">待解决</el-radio>
                <el-radio :label="2">已解决</el-radio>
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
    report: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      imageUrl:'',
      defaultreport:{},
    }
  },
  created () {
  },
  methods: {
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
