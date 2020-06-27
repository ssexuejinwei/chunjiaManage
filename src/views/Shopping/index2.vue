<template>
  <div>
    <div v-if='!isEdit' class ='couponUselist'>
      <page-header :title="this.$route.query.coupon.title+'优惠券使用管理'"/>
      <el-page-header @back="goBack" />
      <el-container>
        <el-main>
          <el-table
            :data="couponUseTableData"
            @selection-change="handleSelect"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              label="用户"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{scope.row.user.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="优惠券"
              align="center"
            >
            <template slot-scope="scope">
                <span>{{scope.row.coupon.title}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="使用情况"
              align="center"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.status==1">已使用</span>
                <span v-if="scope.row.status==0">未使用</span>
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
                  变更使用情况
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
              <el-button @click="deletecouponUses">
                删除
              </el-button>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
export default {
  data () {
    return {
      couponId:'',
      couponUse:{},
      isEdit: false,
      isAdd: false,
      couponUseTableData:[],
      couponUseForm:{},
      selectedcouponUses:[]
    }
  },
  created () {
    this.couponId = this.$route.query.coupon.id
    for (let i = 0; i < 4; i ++) {
      this.couponUseTableData.push({
        id:i,
        name:'朝晖水果店',
        address:'朝阳路130号',
        content:'满30减5',
        all:'100',
        use:'30',
      })
    }
  },
  methods: {
    getData () {
      Axios.get('getUs',{
        params:{
          coupon_id:this.couponId
        }
      }).then(response => {
        this.couponUseTableData = response.data.data
      }).catch(e => {
        console.error(e)
        this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
        this.couponUseTableData = []
      }).finally(() => { this.loading = false })
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
      let changeStatus = this.couponUseTableData[index].status == 0?1:0
      Axios.post('/sellerctr/addActivity', qs.stringify({
        coupon_id:this.couponId,
        status:changeStatus
        }))
        .then(() => {
          this.$alert('修改成功', '成功').then(() => {
            this.couponUseTableData[index].status = changeStatus
          })
        }).catch(e => {
          this.$alert(`错误原因: ${e.message || '未知错误'}`, '添加失败')
        })
    },
    addcouponUse() {
      this.isAdd = false
    },
    deletecouponUse (couponUse) {
      console.log('couponUse', couponUse)
      const data = {
        id: couponUse.id
      }
      // return this.$axios.post('/sellerctr/deleteParents', qs.stringify(data))
    },
    deletecouponUses () {
      this.$confirm('是否删除选中的优惠券使用', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedcouponUses.map(this.deletecouponUse))
          .then(() => this.$alert('删除成功', '成功', { type: 'success' }), (e) => {
            console.error(e)
            this.$alert('删除失败', '错误', { type: 'error' })
          })
          .then()
      })
    },
    handleSelect (val) {
      this.selectedcouponUses = val
    },
    goBack(){
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss">

</style>
