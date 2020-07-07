<template>
  <div>
    <div v-if='!isEdit' class ='couponlist'>
      <page-header :title="this.$route.query.shopping.name+'优惠券信息管理'"/>
      <el-page-header @back="goBack" />
      <el-container>
        <el-main>
          <el-table
            :data="couponTableData"
            @selection-change="handleSelect"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="title"
              label="优惠券名"
              align="center"
            />
            <el-table-column
              prop="descr"
              label="具体信息"
              align="center"
            />
            <el-table-column
              prop="left_number"
              label="剩余数量"
              align="center"
            />
            <el-table-column
              label="状态"
              align="center"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.status == 0">生效中</span>
                <span v-if="scope.row.status == 1">过期</span>
              </template>
            </el-table-column>
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
                  @click="checkUse(scope.$index,scope.row)"
                >
                  使用情况
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer>
          <el-row style="margin-top:1.5rem; ">
            <el-col :span="3">
              <el-button @click='isAdd = true'>添加优惠券</el-button>
            </el-col>
            <el-col :span="5">
              <el-button @click="deletecoupons">
                删除优惠券
              </el-button>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
      <el-dialog
        title="优惠券信息"
        :visible.sync="isAdd "
      >
        <el-form
          :model="couponForm"
          label-width="120px"
          style="width:32rem;"
        >
          <el-form-item
            label="优惠券名"
            prop="title"
          >
            <el-input
              v-model="couponForm.title"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="优惠券详细信息"
            prop="descr"
          >
            <el-input
              v-model="couponForm.descr"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="优惠券数量"
            prop="number"
          >
            <el-input
              v-model="couponForm.number"
              autocomplete="off"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isAdd = false">取 消</el-button>
            <el-button type="primary" @click="addcoupon">确 定</el-button>
          </span>
        </el-dialog>
    </div>
    <div v-if="isEdit" class ='couponInfo'>
      <couponEdit :coupon='coupon' @update="handleEditFinish" @back="backHome"></couponEdit>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
  import Axios from 'axios'
  import qs from 'qs'
import couponEdit from './components/couponEdit'
export default {
  components: {
    couponEdit
  },
  data () {
    return {
      api:'/api/community/manage/coupon/',
      storeID:'',
      coupon:{},
      isEdit: false,
      isAdd: false,
      couponTableData:[],
      couponForm:{},
      selectedcoupons:[]
    }
  },
  created () {
    this.storeID = this.$route.query.shopping.id
    this.getData()
  },
  methods: {
    getData () {
      Axios.get(this.api,{
        params:{
          id:this.storeID
        }
      }).then(response => {
        this.couponTableData = response.data.data
      }).catch(e => {
        console.error(e)
        this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
        this.couponTableData = []
      }).finally(() => { this.loading = false })
    },
    handleEditFinish (val) {
      if (val) {
        //获取新数据
        this.isEdit = false
        this.getData()
      }
    },
    backHome (val) {
      this.isEdit = val
    },
    handleEdit(index,row) {
      this.isEdit = true
      this.coupon = this.couponTableData[index]
      console.log(index,row)
    },
    addcoupon() {
      Axios.post(this.api, qs.stringify({
        ...this.couponForm,
        id:this.storeID
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
    deletecoupon (coupon) {
      console.log('coupon', coupon)
      const data = {
        id: coupon.id
      }
      return this.$axios.delete(this.api, {data:qs.stringify(data)})
    },
    deletecoupons () {
      this.$confirm('是否删除选中的优惠券', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedcoupons.map(this.deletecoupon))
          .then(() => this.$alert('删除成功', '成功', { type: 'success' }).then(()=>{
            this.getData()
          }), (e) => {
            console.error(e)
            this.$alert('删除失败', '错误', { type: 'error' })
          })
      })
    },
    handleSelect (val) {
      this.selectedcoupons = val
    },
    goBack(){
      this.$router.push({
        path: '/shopping',
      })
    },
    checkUse(index,row) {
      this.$router.push({
        path: '/couponUse',
        query: {
          coupon: this.couponTableData[index],
          shopping:this.$route.query.shopping
        }
      })
    }
  }
}
</script>

<style lang="scss">
  
</style>
