<template>
  <div>
    <div v-if='!isEdit' class ='shoppinglist'>
      <page-header title="商家信息管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="shoppingTableData"
            @selection-change="handleSelect"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="name"
              label="商家"
              align="center"
            />
            <el-table-column
              prop="phone_number"
              label="联系电话"
              align="center"
            />
            <el-table-column
              prop="address"
              label="地址"
              align="center"
            />
            <el-table-column
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="medium"
                  @click="handleEdit(scope.$index,scope.row)"
                >
                  详情
                </el-button>
                <el-button
                  size="medium"
                  @click="checkCoupon(scope.$index,scope.row)"
                >
                  优惠券信息
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer>
          <el-row style="margin-top:1.5rem; ">
            <el-col :span="3">
              <el-button @click='isAdd = true'>添加商家</el-button>
            </el-col>
            <el-col :span="5">
              <el-button @click="deleteshoppings">
                删除商家
              </el-button>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
      <el-dialog
        title="商家信息"
        :visible.sync="isAdd "
      >
        <el-form
          :model="shoppingForm"
          label-width="100px"
          style="width:31.25rem;"
        >
          <el-form-item
            label="logo"
          >
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
            label="商家名"
            prop="name"
          >
            <el-input
              v-model="shoppingForm.name"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="商家地址"
            prop="address"
          >
            <el-input
              v-model="shoppingForm.address"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="联系电话"
            prop="phone_number"
          >
            <el-input
              v-model="shoppingForm.phone_number"
              autocomplete="off"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isAdd = false">取 消</el-button>
            <el-button type="primary" @click="addshopping">确 定</el-button>
          </span>
        </el-dialog>
    </div>
    <div v-if="isEdit" class ='shoppingInfo'>
      <shoppingEdit :shopping='shopping' @update="handleEditFinish" @back="backHome"></shoppingEdit>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
import shoppingEdit from './components/shoppingEdit'
export default {
  components: {
    shoppingEdit
  },
  data () {
    return {
      selectedshoppings:[],
      shopping:{},
      isEdit: false,
      isAdd: false,
      shoppingTableData:[],
      shoppingForm:{},
      imageUrl:'',
      image:''
    }
  },
  created () {
    for (let i = 0; i < 4; i ++) {
      this.shoppingTableData.push({
        id:i,
        name:'朝晖水果店',
        content:'菠萝、桃子、西瓜、荔枝等',
        address:'朝阳路130号',
      })
    }
  },
  methods: {
    getData () {
      Axios.get('getUs').then(response => {
        this.shoppingTableData = response.data.data
      }).catch(e => {
        console.error(e)
        this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
        this.activityTableData = []
      }).finally(() => { this.loading = false })
    },
    checkCoupon(index,row) {
      this.$router.push({
        path: '/couponUse',
        query: {
          shopping: this.shoppingTableData[index]
        }
      })
    },
    handleEditFinish (val) {
      if (val) {
        //获取新数据
        this.isEdit = false
      }
    },
    backHome (val) {
      this.isEdit = val
    },
    handleEdit(index,row) {
      this.isEdit = true
      this.shopping = this.shoppingTableData[index]
      console.log(index,row)
    },
    addshopping() {
      Axios.post('/sellerctr/addActivity', qs.stringify({
        ...this.shoppingForm,
        logo:this.image
        }))
        .then(() => {
          this.$alert('添加成功', '成功').then(() => {
            this.getData()
            this.isAdd = false
          })
        }).catch(e => {
          console.error(e)
          this.$alert(`错误原因: ${e.message || '未知错误'}`, '添加失败')
        })
    },
    deleteshopping (shopping) {
      console.log('shopping', shopping)
      const data = {
        id: shopping.id
      }
      // return this.$axios.post('/sellerctr/deleteParents', qs.stringify(data))
    },
    deleteshoppings () {
      this.$confirm('是否删除选中的商家', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedshoppings.map(this.deleteshopping))
          .then(() => this.$alert('删除成功', '成功', { type: 'success' }), (e) => {
            console.error(e)
            this.$alert('删除失败', '错误', { type: 'error' })
          })
          .then()
      })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.image = file.raw
    },
    handleSelect (val) {
      this.selectedactivitys = val
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
