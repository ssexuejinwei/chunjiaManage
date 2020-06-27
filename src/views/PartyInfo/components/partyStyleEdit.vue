<template>
  <div class="PartyStyleEditInfo">
    <page-header title="党员风采详细信息" />
    <el-page-header @back="goBack" />
    <br>
    <br>
    <el-container style="width: 100%;">
        <el-main>
        <el-form
          ref="form"
          class="form"
          :model="PartyStyle"
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
          <el-form-item label="姓名">
            <el-input v-model="PartyStyle.name" />
          </el-form-item>
          <el-form-item label="所属网格">
            <el-select v-model="PartyStyle.grid" placeholder="请选择">
                <el-option
                  v-for="item in PartyStyle.options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="先进事迹">
            <el-input v-model="PartyStyle.content" />
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
    PartyStyle: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      defaultPartyStyle:{},
    }
  },
  created () {
    console.log(this.PartyStyle)
  },
  methods: {
    save () {
      //调API
      Axios.post('/sellerctr/addActivity', qs.stringify({
        party_style_id:this.PartyStyle.id,
        name:this.PartyStyle.name,
        grid_id:this.PartyStyle.grid,
        deed:this.PartyStyle.deed
      })).then(() => {
          this.$alert('修改成功', '成功').then(() => {
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
