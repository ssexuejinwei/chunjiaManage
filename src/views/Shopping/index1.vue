<template>
  <div>
    <div v-if='!isEdit' class ='shoppinglist'>
      <page-header title="商家信息管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="shoppingTableData"
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
              prop="content"
              label="经营项目"
              align="center"
            />
            <el-table-column
              prop="address"
              label="地址"
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
            label="经营项目"
            prop="content"
          >
            <el-input
              v-model="shoppingForm.content"
              autocomplete="off"
            />
          </el-form-item>
         <!-- <el-form-item
            label="优惠券"
            prop="coupon"
          >
            <el-input
              v-model="shoppingForm.coupon"
              autocomplete="off"
            />
          </el-form-item> -->
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
      shopping:{},
      isEdit: false,
      isAdd: false,
      shoppingTableData:[],
      shoppingForm:{}
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
      this.isAdd = false
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
