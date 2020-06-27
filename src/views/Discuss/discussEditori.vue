<template>
  <div class="discussEditInfo">
    <page-header title="请您商量详细信息" />
    <el-page-header @back="goBack" />
    <br>
    <br>
    <el-container style="width: 100%;">
        <el-main>
        <el-form
          ref="form"
          class="form"
          :model="discuss"
          label-width="80px"
          style="width:31.25rem;"
        >
<!--          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              action="#"
              accept="image/*"
              :limit="3"
              :http-request="handleUpload"
              :on-success="handleUploadSuccess"
              :on-change="handleUploadChange"
              :show-file-list="false"
            >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <img
                v-if="squareImageUrl==''?false:true"
                :src="squareImageUrl"
                class="avatar"
              >
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              />
            </el-upload> -->
          <!-- </el-form-item> -->
          <el-form-item label="议题标题">
            <el-input v-model="discuss.title" />
          </el-form-item>
          <el-form-item label="议题类型">
            <el-input v-model="discuss.type" />
          </el-form-item>
          <el-form-item label="议事时间">
            <el-input v-model="discuss.date" />
          </el-form-item>
          <el-form-item label="议事内容">
            <el-input v-model="discuss.content" />
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
    discuss: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      defaultdiscuss:{},
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
