<template>
  <div>
    <div class="cover">
      <img :src="img">
    </div>
    <div class="info">
      <div>{{ name }}</div>
      <div class="count">
        已售 {{ sell }} / 库存 {{ capacity }}
      </div>
      <div>
        <button
          :class="btnStyle"
          :disabled="status === '已售罄'"
        >
          {{ status }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    sell: {
      type: Number,
      default: 1
    },
    capacity: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      default: ''
    },
    img: {
      type: String,
      default: ''
    }
  },
  computed: {
    btnStyle () {
      return {
        btn: true,
        'btn-ing': this.status === '出售中',
        'btn-end': this.status === '已售罄'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cover {
  img {
    object-fit: cover;
    width: 100%;
  }

  width: 150px;
  height: 150px;
  background: #eee;
}

.info {
  text-align: center;
}

.btn {
  border-radius: 1rem;
  padding: 0.25rem 1.25rem;

  &-ing {
    color: #fff;
    background: linear-gradient(to right, #f71616, #f18636)
  }

  &-end {
    color: #fff;
    background: #888;
  }
}

.count {
  font-size: 0.8em;
  color: #999;
}
</style>
