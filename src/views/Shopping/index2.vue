<template>
  <div>
    <div v-if='!isEdit' class ='couponUselist'>
      <page-header title="优惠券使用管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="couponUseTableData"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="name"
              label="店铺"
              align="center"
            />
            <el-table-column
              prop="address"
              label="地址"
              align="center"
            />
            <el-table-column
              prop="content"
              label="优惠券内容"
              align="center"
            />
            <el-table-column
              prop="all"
              label="全部"
              align="center"
            />
            <el-table-column
              prop="use"
              label="已使用"
              align="center"
            />
            <!-- <el-table-column
              prop="coupon"
              label="优惠券"
              align="center"
            /> -->
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
    <div v-if="isEdit" class ='couponUseInfo'>
      <couponUseEdit :couponUse='couponUse' @update="handleEditFinish" @back="backHome"></couponUseEdit>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
import couponUseEdit from './components/couponUseEdit'
export default {
  components: {
    couponUseEdit
  },
  data () {
    return {
      couponUse:{},
      isEdit: false,
      isAdd: false,
      couponUseTableData:[],
      couponUseForm:{}
    }
  },
  created () {
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
      this.couponUse = this.couponUseTableData[index]
      console.log(index,row)
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
    }
  }
}
</script>

<style lang="scss">
$Green: #69bc38;
$Gray: #cdcdcb;
$Red : #92535e;
$pink : #FE8083;
.teachHeader  {
  padding: 0.5rem 1rem;
  margin-bottom: 2rem;
  background: $pink;
  display: flex;
  justify-content: space-between;

  a {
    color: inherit;
    text-decoration: none;
  }

  h1 {
    font-size: 1rem;
    margin: 0;
  }
}
  .chooseMenu{
    margin-left: 1.25rem;
    width:12.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }
  .chooseMenu .el-menu-item.is-active {
    background-color: $Green ;
    font-size: x-large !important;
    border: 1px solid !important;
  }
</style>
