<template>
  <div>
    <div v-if='!isEdit' class ='suggestlist'>
      <page-header title="提议管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="suggestTableData"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="name"
              label="提议人"
              align="center"
            />
            <el-table-column
              prop="tel"
              label="联系方式"
              align="center"
            />
            <el-table-column
              prop="title"
              label="议题标题"
              align="center"
            />
            <el-table-column
              prop="type"
              label="议题类型"
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
          <!-- <el-row style="margin-top:1.5rem; ">
            <el-col :span="3">
              <el-button @click='isAdd = true'>添加微信息</el-button>
            </el-col>
            <el-col :span="5">
              <el-button @click="deletesuggests">
                删除微信息
              </el-button>
            </el-col>
          </el-row> -->
        </el-footer>
      </el-container>
    <!--  <el-dialog
        title="提议"
        :visible.sync="isAdd "
      >
        <el-form
          :model="suggestForm"
          label-width="100px"
          style="width:31.25rem;"
        >
          <el-form-item
            label="标题"
            prop="title"
          >
            <el-input
              v-model="suggestForm.title"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="具体内容"
            prop="content"
          >
            <el-input
              v-model="suggestForm.content"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="时间截点"
            prop="date"
          >
            <el-input
              v-model="suggestForm.date"
              autocomplete="off"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isAdd = false">取 消</el-button>
            <el-button type="primary" @click="addsuggest">确 定</el-button>
          </span>
        </el-dialog> -->
    </div>
    <div v-if="isEdit" class ='suggestInfo'>
      <suggestEdit :suggest='suggest' @update="handleEditFinish" @back="backHome"></suggestEdit>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
import suggestEdit from './suggestEdit'
export default {
  components: {
    suggestEdit
  },
  data () {
    return {
      suggest:{},
      isEdit: false,
      isAdd: false,
      suggestTableData:[],
      suggestForm:{}
    }
  },
  created () {
    for (let i = 0; i < 4; i ++) {
      this.suggestTableData.push({
        id:i,
        name:'赵四',
        tel:'13823012412',
        title:'议题标题1',
        type:'社区大事',
        content:'如何在疫情期间分发口罩',
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
      this.suggest = this.suggestTableData[index]
      console.log(index,row)
    },
    addsuggest() {
      this.isAdd = false
    },
    deletesuggest (suggest) {
      console.log('suggest', suggest)
      const data = {
        id: suggest.id
      }
      // return this.$axios.post('/sellerctr/deleteParents', qs.stringify(data))
    },
    deletesuggests () {
      this.$confirm('是否删除选中的微信息', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedsuggests.map(this.deletesuggest))
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
