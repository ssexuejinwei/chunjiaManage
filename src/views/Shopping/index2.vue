<template>
  <div>
    <page-header title="优惠券使用管理"/>
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
            prop="status"
            label="状态"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="info"
            label="信息"
            align="center"
            sortable="custom"
          />
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      UserTableData:[
        {
          name:'满30减10',
          status:'已过期',
          info:'具体内容..........',
        },
        {
          name:'满30减10',
          status:'可使用',
          info:'具体内容..........',
        },{
          name:'满30减10',
          status:'可使用',
          info:'具体内容..........',
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
