<template>
  <div class="communityInfoEditInfo">
    <page-header title="详细信息" />
    <el-page-header @back="goBack" />
    <br>
    <br>
    <el-container style="width: 100%;">
        <el-main>
          <el-form
            v-if="type==1"
            :model="communityInfo"
            label-width="100px"
            style="width:31.25rem;"
          >
            <el-form-item
              label="姓名"
              prop="name"
            >
              <el-input
                v-model="communityInfo.name"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item
              label="职位"
              prop="postion"
            >
              <el-input
                v-model="communityInfo.position"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item size="large">
              <el-button @click="save" type="success">
                保存
              </el-button>
            </el-form-item>
          </el-form>
          <el-form
            v-if="type==2"
            :model="communityInfo"
            label-width="100px"
            style="width:31.25rem;"
          >
            <el-form-item
              label="支部名"
              prop="name"
            >
              <el-input
                v-model="communityInfo.name"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item
              label="支部书记"
              prop="clerk"
            >
              <el-input
                v-model="communityInfo.clerk"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item
              label="联系电话"
              prop="tel"
            >
              <el-input
                v-model="communityInfo.tel"
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
    communityInfo: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: () => {}
    }
  },
  data () {
    return {
      defaultcommunityInfo:{},
    }
  },
  created () {
    console.log(this.communityInfo)
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
