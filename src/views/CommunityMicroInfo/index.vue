<template>
  <div>
    <page-header title="社区微信息"/>
    <el-container>
      <el-main>
        <el-table
          :data="UserTableData"
          highlight-current-row
          :border="true"
        >
          <el-table-column
            type="selection"
          />
          <el-table-column
            prop="name"
            label="名称"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="info"
            label="详细信息"
            align="center"
            sortable="custom"
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
                修改
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <el-row>
          <el-col :span="6">
            <!-- <el-button type='danger' @click='isAdd = true'>添加新用户</el-button> -->
            <el-button
              @click="deleteUsers"
            >
              发布
            </el-button>
          </el-col>
          <el-col :span="6">
            <!-- <el-button type='danger' @click='isAdd = true'>添加新用户</el-button> -->
            <el-button
              @click="deleteUsers"
            >
              删除
            </el-button>
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      UserTableData:[
        {
          name:'5-4日组织观影',
          info:'详细信息...........',
        },
        {
          name:'5-4日组织观影',
          info:'详细信息...........',
        },
        {
          name:'5-4日组织观影',
          info:'详细信息...........',
        }
      ]
    }
  },
  created () {
  },
  methods: {
    handleEdit(index,row) {
      console.log(index,row)
    },
    deleteUsers(){
      
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
