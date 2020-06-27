<template>
  <div>
    <div v-if='!isEdit' class ='discusslist'>
      <page-header title="商量信息管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="discussTableData"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
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
              prop="date"
              label="议题时间"
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
              <el-button @click='isAdd = true'>发布</el-button>
            </el-col>
            <el-col :span="5">
              <el-button @click="deletediscusss">
                删除
              </el-button>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
      <el-dialog
        title="商量信息"
        :visible.sync="isAdd "
      >
        <el-form
          :model="discussForm"
          label-width="100px"
          style="width:31.25rem;"
        >
          <el-form-item
            label="标题"
            prop="title"
          >
            <el-input
              v-model="discussForm.title"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="议事类型"
            prop="type"
          >
            <el-radio-group v-model="discussForm.type">
              <el-radio :label="1">网格小事</el-radio>
              <el-radio :label="2">社区大事</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="议事内容"
            prop="content"
          >
            <el-input
              v-model="discussForm.content"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="议事时间"
            prop="date"
          >
          <el-date-picker
            v-model="discussForm.date"
            type="date"
            placeholder="时间">
          </el-date-picker>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isAdd = false">取 消</el-button>
            <el-button type="primary" @click="adddiscuss">确 定</el-button>
          </span>
        </el-dialog>
    </div>
    <div v-if="isEdit" class ='discussInfo'>
      <discussEdit :discuss='discuss' @update="handleEditFinish" @back="backHome"></discussEdit>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
import discussEdit from './discussEdit'
export default {
  components: {
    discussEdit
  },
  data () {
    return {
      discuss:{},
      isEdit: false,
      isAdd: false,
      discussTableData:[],
      discussForm:{}
    }
  },
  created () {
    for (let i = 0; i < 4; i ++) {
      this.discussTableData.push({
        id:i,
        title:'议题1',
        type:'网格小事',
        date:'2020年6月18日',
        content:'商量是否发放口罩的时间'
      })
    }
  },
  methods: {
		getData () {
		  Axios.get('getUs',{
		    params:{
		      tag:1
		    }
		  }).then(response => {
		    this.discussTableData = response.data.data
		  }).catch(e => {
		    console.error(e)
		    this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
		    this.discussTableData = []
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
      this.discuss = this.discussTableData[index]
      console.log(index,row)
    },
    adddiscuss() {
      this.isAdd = false
    },
    deletediscuss (discuss) {
      console.log('discuss', discuss)
      const data = {
        id: discuss.id
      }
      // return this.$axios.post('/sellerctr/deleteParents', qs.stringify(data))
    },
    deletediscusss () {
      this.$confirm('是否删除选中的信息', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selecteddiscusss.map(this.deletediscuss))
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
