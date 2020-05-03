<template>
  <el-tag :type="color">
    {{ name }}
  </el-tag>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  computed: {
    name () {
      const { state, reserve, sales, store } = this.product
      if (String(state) === String('1')) {
        return '未上架'
      }
      if (String(state) === String('0')) {
        if (reserve === '1') return '预售中'
        return '出售中'
      }

      if (store > 0 && sales > 0 && sales >= store) {
        return '已售罄'
      }

      return '未知'
    },
    color () {
      if (this.name === '出售中') return 'danger'
      if (this.name === '预售中') return 'success'
      if (this.name === '已售罄' || this.name === '未上架') return 'info'
      return ''
    }
  }
}
</script>
