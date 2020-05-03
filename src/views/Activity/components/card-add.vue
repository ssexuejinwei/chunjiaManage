<template>
  <div class="add">
    <div class="container">
      <i class="el-icon-plus" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.add {
  cursor: pointer;
  width: 150px;
  height: 200px;

  border: 1px #333 solid;

  background: #eee;

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    opacity: 0.7;
  }
}

.container {
  width: 100px;
  height: 100px;
  background: #fff;
  border-radius: 100%;

  font-size: 25px;

  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
