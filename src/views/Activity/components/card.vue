<template>
  <div class="card">
    <div class="cover">
      <img :src="img">
    </div>
    <div class="info">
      <div class="time">
        {{ format(start) }} - {{ format(end) }}
      </div>
      <div>报名人数: {{ count }} / {{ capacity }}</div>
      <div v-if="score" class="score">
        {{ score }}积分
      </div>
      <!-- <div>
        <button
          :class="btnStyle"
          :disabled="status === '已结束'"
        >
          {{ status }}
        </button>
      </div> -->
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'

export default {
  props: {
    start: {
      type: [Date, String],
      default: ''
    },
    end: {
      type: [Date, String],
      default: ''
    },
    count: {
      type: [Number, String],
      default: 1
    },
    score: {
      type: [Number, String],
      default: 0
    },
    capacity: {
      type: [Number, String],
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
        'btn-ing': this.status === '进行中',
        'btn-end': this.status === '已结束'
      }
    }
  },
  methods: {
    format (date) {
      if (typeof date === 'string') return date
      return format(date, 'yyyy.MM.dd')
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  position: relative;
}

.cover {
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  width: 150px;
  height: 200px;
  background: #eee;
}

.info {
  text-align: center;
  .time {
    font-size: 0.8em;
  }
}

.btn {
  border-radius: 1rem;
  padding: 0.25rem 1.25rem;

  &-ing {
    color: #fff;
    background: linear-gradient(to right, #1111ec, #e45ce4)
  }

  &-end {
    color: #fff;
    background: #888;
  }
}

.score {
  position: absolute;
  font-size: 0.8em;

  background: linear-gradient(to right, #1111ec, #e45ce4);
  color: #fff;
  padding: 0.25em 0.75em;
  border-radius: 16px;
  top: 5%;
  right: -4%;
}
</style>
