<template>
  <div>
    <div v-if='!isEdit' class ='communityMicroInfolist'>
      <page-header title="社区微信息管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="communityMicroInfoTableData"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="title"
              label="标题"
              align="center"
            />
            <el-table-column
              prop="content"
              label="具体信息"
              align="center"
            />
            <el-table-column
              prop="date"
              label="时间截点"
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
              <el-button @click='isAdd = true'>添加微信息</el-button>
            </el-col>
            <el-col :span="5">
              <el-button @click="deletecommunityMicroInfos">
                删除微信息
              </el-button>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
      <el-dialog
        title="社区微信息"
        :visible.sync="isAdd "
      >
        <el-form
          :model="communityMicroInfoForm"
          label-width="100px"
          style="width:31.25rem;"
        >
          <el-form-item
            label="标题"
            prop="title"
          >
            <el-input
              v-model="communityMicroInfoForm.title"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="具体内容"
            prop="content"
          >
            <el-input
              v-model="communityMicroInfoForm.content"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="时间截点"
            prop="date"
          >
            <el-input
              v-model="communityMicroInfoForm.date"
              autocomplete="off"
            />
          </el-form-item>
         <!-- <el-form-item
            label="优惠券"
            prop="coupon"
          >
            <el-input
              v-model="communityMicroInfoForm.coupon"
              autocomplete="off"
            />
          </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isAdd = false">取 消</el-button>
            <el-button type="primary" @click="addcommunityMicroInfo">确 定</el-button>
          </span>
        </el-dialog>
    </div>
    <div v-if="isEdit" class ='communityMicroInfoInfo'>
      <communityMicroInfoEdit :communityMicroInfo='communityMicroInfo' @update="handleEditFinish" @back="backHome"></communityMicroInfoEdit>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
import communityMicroInfoEdit from './communityMicroInfoEdit'
export default {
  components: {
    communityMicroInfoEdit
  },
  data () {
    return {
      communityMicroInfo:{},
      isEdit: false,
      isAdd: false,
      communityMicroInfoTableData:[],
      communityMicroInfoForm:{}
    }
  },
  created () {
    for (let i = 0; i < 4; i ++) {
      this.communityMicroInfoTableData.push({
        id:i,
        title:'政府文件1',
        content:'每个月每户可以去居委会领取口罩',
        date:'2020年6月',
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
      this.communityMicroInfo = this.communityMicroInfoTableData[index]
      console.log(index,row)
    },
    addcommunityMicroInfo() {
      this.isAdd = false
    },
    deletecommunityMicroInfo (communityMicroInfo) {
      console.log('communityMicroInfo', communityMicroInfo)
      const data = {
        id: communityMicroInfo.id
      }
      // return this.$axios.post('/sellerctr/deleteParents', qs.stringify(data))
    },
    deletecommunityMicroInfos () {
      this.$confirm('是否删除选中的微信息', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedcommunityMicroInfos.map(this.deletecommunityMicroInfo))
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
