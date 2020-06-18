<template>
  <div>
    <div v-if='!isEdit' class ='couponlist'>
      <page-header title="优惠券信息管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="couponTableData"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="name"
              label="商家名"
              align="center"
            />
            <el-table-column
              prop="content"
              label="优惠券信息"
              align="center"
            />
            <el-table-column
              prop="number"
              label="数量"
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
          label-width="100px"
          style="width:31.25rem;"
        >
          <el-form-item
            label="商家名"
            prop="name"
          >
            <el-input
              v-model="couponForm.name"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="优惠券信息"
            prop="content"
          >
            <el-input
              v-model="couponForm.content"
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
import couponEdit from './components/couponEdit'
export default {
  components: {
    couponEdit
  },
  data () {
    return {
      coupon:{},
      isEdit: false,
      isAdd: false,
      couponTableData:[],
      couponForm:{}
    }
  },
  created () {
    for (let i = 0; i < 4; i ++) {
      this.couponTableData.push({
        id:i,
        name:'朝晖水果店',
        content:'满30减50',
        number:'100',
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
      this.coupon = this.couponTableData[index]
      console.log(index,row)
    },
    addcoupon() {
      this.isAdd = false
    },
    deletecoupon (coupon) {
      console.log('coupon', coupon)
      const data = {
        id: coupon.id
      }
      // return this.$axios.post('/sellerctr/deleteParents', qs.stringify(data))
    },
    deletecoupons () {
      this.$confirm('是否删除选中的优惠券', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedcoupons.map(this.deletecoupon))
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
