<template>
  <div class="userEditInfo">
    <page-header title="用户信息" />
    <br>
    <el-page-header @back="goBack" />
    <br>
    <el-container style="width: 100%;">
      <el-col :span="18">
        <el-main>
          <el-form
            ref="form"
            label-position="left"
            label-width="80px"
            class="form"
            :model="form"
          >
            <el-form-item label="用户头像">
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
                <img
                  v-if="squareImageUrl==''?false:true"
                  :src="squareImageUrl"
                  class="avatar"
                >
                <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
                />
              </el-upload>
              <!-- <p >头像</p> -->
            </el-form-item>
            <el-form-item label="昵称">
              <el-col :span="8">
                <el-input v-model="form.nickName" />
              </el-col>
            </el-form-item>
            <el-form-item label="真实姓名">
              <el-col :span="8">
                <el-input v-model="form.name" />
              </el-col>
            </el-form-item>
            <el-row>
              <el-col :span="9">
                <el-form-item label="微信ID">
                  <el-input
                    v-model="form.wechat"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="9">
                <el-form-item label="会员时间">
                  <el-input
                    v-model="form.date"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="9">
                <el-form-item label="个人积分">
                  <el-input
                    v-model="form.points"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-col :span="24">
              <el-form-item label="会员等级">
                <el-radio-group
                  v-model="form.level"
                  disabled
                >
                  <el-radio-button label="Lv 1" />
                  <el-radio-button label="Lv 2" />
                  <el-radio-button label="Lv 3" />
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-form-item label="电话">
              <el-col :span="8">
                <el-input v-model="form.tel" />
              </el-col>
            </el-form-item>
            <el-form-item label="性别">
              <el-col :span="8">
                <el-input v-model="form.sex" />
              </el-col>
            </el-form-item>
            <el-form-item label="年龄">
              <el-col :span="12">
                <el-input v-model="form.age" />
              </el-col>
            </el-form-item>
            <el-form-item label="收货地址">
              <div
                v-for="(data, index) in form.address"
                :key="index"
              >
                <el-row style="margin-top: 0.625rem;">
                  <el-col :span="12">
                    <el-input v-model="data['content']" />
                  </el-col>
                  <el-col
                    :span="4"
                    style="margin-left: 0.8625rem;"
                  >
                    <el-checkbox
                      v-model="form.address[index]['isDefault']"
                      @change="((value)=>{setDefault(value,index)})"
                    >
                      设为默认地址
                    </el-checkbox>
                  </el-col>
                  <el-col
                    v-if="index==form.address.length-1"
                    :span="4"
                    style="margin-left: 0.8625rem;"
                  >
                    <el-button @click="addAddress">
                      <i class="el-icon-plus" />
                    </el-button>
                  </el-col>
                </el-row>
              </div>
              <el-row v-if="form.address.length == 0">
                <el-col :span="12">
                  <el-input
                    v-model="form.address[0]"
                    placeholder="还未添加收货地址"
                  />
                </el-col>
                <el-col
                  :span="4"
                  style="margin-left: 0.8625rem;"
                >
                  <el-button @click="addAddress">
                    <i class="el-icon-plus" />
                  </el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item size="large">
              <el-button
                class="save"
                @click="save"
              >
                保存
              </el-button>
              <el-button
                class="save"
                @click="deleteUser"
              >
                删除
              </el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-col>
    </el-container>
    <!-- 填写收货地址对话框 -->
    <el-dialog
      title="填写地址信息"
      :visible.sync="addAddressVisible"
    >
      <el-form
        :model="addressForm"
        label-width="80px"
      >
        <el-form-item label="收件人">
          <el-col :span="8">
            <el-input v-model="addressForm.name" />
          </el-col>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="手机号">
              <el-input v-model="addressForm.tel" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮政编码">
              <el-input v-model="addressForm.code" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="地址">
          <v-distpicker @selected="onSelected" />
          <el-input
            v-model="addressForm.detail"
            type="textarea"
            placeholder="详细地址"
            style="margin-top: 1.25rem;"
          />
        </el-form-item>
        <el-form-item style="text-align: right;">
          <el-checkbox v-model="addressForm.setDefault">
            设为默认地址
          </el-checkbox>
        </el-form-item>
        <el-form-item style="text-align: center;">
          <el-button
            type="danger"
            @click="submit"
          >
            提 交
          </el-button>
          <el-button
            type="success"
            @click="addAddressVisible = false"
          >
            取 消
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
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
    user: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      region: {},
      squareImageUrl: '',
      addAddressVisible: false,
      form: {
        setDefault: false,
        labelWidth: '10px',
        name: '韩',
        id: 134,
        tel: '1234145',
        nickName: '3个月',
        wechat: '王小佳',
        sex: '女',
        date: 34,
        points: 134,
        age: '3',
        level: '3个月',
        birth: '2019-9-8',
        address: []
      },
      addressForm: {
        name: '',
        tel: '',
        code: '',
        detail: '',
        setDefault: true
      },
      addressList: [],
      tableCourse: [],
      tableAttend: [],
      fileList: []

    }
  },
  created () {
    this.form.id = this.user.id
    this.form.nickName = this.user.nickName
    this.form.wechat = this.user.wechat
    this.form.name = this.user.name
    this.form.date = this.user.date
    this.form.sex = this.user.sex
    this.form.tel = this.user.tel
    this.form.points = this.user.points
    this.form.age = this.user.age
    this.form.level = this.user.level
    this.squareImageUrl = this.user.avatar
    // this.$axios.get(){
    this.getAddress()
    // }
  },
  methods: {
    onSelected (data) {
      this.region = data
      console.log(this.region.province.value + '-' + this.region.city.value + '-' + this.region.area.value)
    },
    deleteUser () {
      const api = '/sellerctr/deleteParents'
      var data = {
        id: this.user.id
      }
      this.$axios.post(api, qs.stringify(data)
      ).then(() => {
        this.$alert('删除成功', {
          confirmButtonText: '确定'
        }).then(() => {
          this.goBack()
          this.$emit('update', true)
        })
      }).catch(() => {
        this.$alert('删除失败')
      })
    },
    save () {
      const api = '/sellerctr/updateParents'
      const params = {
        id: this.user.id,
        nick_name: this.form.nickName,
        avatar: this.squareImageUrl,
        name: this.form.name,
        sex: this.form.sex === '男' ? 0 : 1,
        tel: this.form.tel,
        age: this.form.age
      }
      this.$axios.post(api, qs.stringify(params)
      ).then(() => {
        this.$alert('保存成功', {
          confirmButtonText: '确定'
        }).then(() => {
          this.goBack()
          this.$emit('update', true)
        })
      }).catch(() => {
        this.$alert('表单填写错误,保存失败')
      })
    },
    // 提交地址
    submit () {
      const api = '/parentsctr/addAddress'
      const address = {
        region: {
          label: this.region.province.value + '-' + this.region.city.value + '-' + this.region.area.value,
          value: [1, 1, 1],
          cityCode: this.addressForm.code
        },
        detailed: this.addressForm.detail
      }
      const params = {
        parents_id: this.user.id,
        name: this.addressForm.name,
        head: this.addressForm.name[0],
        address: JSON.stringify(address),
        tel: this.addressForm.tel,
        isDefault: this.addressForm.setDefault
      }
      this.$axios.post(api, qs.stringify(params)
      ).then(() => {
        this.$alert('提交成功', {
          confirmButtonText: '确定'
        }).then(() => {
          this.getAddress()
          this.addAddressVisible = false
          // this.$emit('update',true)
        })
      }).catch(() => {
        this.$alert('表单填写错误,保存失败')
      })
    },
    addAddress () {
      this.addAddressVisible = true
    },
    setDefault (value, index) {
      // console.log(value,index)
      for (const data of this.form.address) {
        data.isDefault = false
      }
      this.form.address[index].isDefault = true
    },
    getAddress () {
      const api = '/parentsctr/getAddress'
      this.form.address = []
      this.addressList = []
      // console.log(this.form['id'])
      this.$axios.get(api, {
        params: {
          parents_id: this.form.id
        }
      }).then((response) => {
        const addressList = response.data.data
        // console.log(addressList)
        for (const address of addressList) {
          const addressInfo = JSON.parse(address.address)
          console.log(addressInfo)
          const obj = {
            id: address.id,
            tel: address.tel,
            name: address.name,
            address: address.address,
            isDefault: Boolean(address.isDefault),
            content: '收件人:' + address.name + '  ' + '联系电话:' + address.tel + '   ' +
                        '收货地址:' + addressInfo.region.label + '-' + addressInfo.detailed
          }
          console.log((Boolean(obj.isDefault)))
          this.addressList.push(obj)
        }
        // console.log('address',this.addressList)
        // sort
        let i = 0
        for (const address of this.addressList) {
          const isDefault = address.isDefault
          if (String(isDefault) === true) {
            const temp = this.addressList[i]
            this.addressList[i] = this.addressList[0]
            this.addressList[0] = temp
            break
          }
          i++
        }
        for (let j = 1; j < this.addressList.length; j++) {
          this.addressList[j].isDefault = false
        }
        // console.log('address',this.addressList)
        this.form.address = this.addressList
      })
    },
    goBack () {
      this.$emit('back', false)
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      console.log(row, column)
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    handleCancel (index, row) {
      console.log(index, row)
    },
    handleMenuSelect (index) {
      this.menuIndex = index
      // console.log(this.menuIndex)
    },
    handleUpload (param) {
      const file = param.file

      const formData = new FormData()
      formData.append('image_url', file)

      return Axios.post('/sellerctr/save', formData, {
        onUploadProgress: param.onProgress
      })
    },
    handleUploadSuccess (res, rawFile) {
      if (res?.data?.data?.fileName) {
        rawFile.url = process.env.VUE_APP_UPLOAD_PUBLIC_URL + res?.data?.data?.fileName
      }
    },
    handleUploadChange (file, fileList) {
      this.fileList = fileList
      this.squareImageUrl = this.fileList[this.fileList.length - 1].url
    }
  }
}
</script>

<style lang="scss">
  .userEditInfo{
    .el-container{
      .el-main{
        .el-form{
          .save{
            color: #FFFFFF;
            background-color: #fa7959;
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
          }
      }
    }
  }
</style>
