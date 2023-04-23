<template>
  <div class="header-info">
    <div class="logo">
      <img class="icon" src="~@/assets/logo.png" alt="logo" />
      <span class="title">行程编辑器</span>
    </div>
    <div class="operation">
      <span class="tips">
        <i class="el-icon-info icon"></i>
        <span>温馨提示：行程编辑过程中，系统会自动保存</span>
      </span>
      <el-button type="danger" class="but" @click="closeTab">关闭</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
        test: '中文1',
        rules: {
            test: {message: this.$t('中文2')}
        },
    }
  },
  created() {
      const str = '中文3'
  },
  methods: {
    // 关闭当前页
    closeTab() {
      if (window.opener) {
        window.opener = null
      } else {
        window.location.href = 'about:blank'
      }

      window.close()
    },
  },
}
</script>

<style scoped lang="scss">
.header-info {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 25px 30px;
}
.logo {
  display: flex;
  align-items: center;
  .icon {
    width: 28px;
  }
  .title {
    font-weight: 600;
    color: var(--text-color-primary);
    margin-left: 6px;
    font-size: var(--h1);
  }
}
.operation {
  .tips {
    color: var(--text-color-secondary);
    margin-right: 20px;
    .icon {
      margin-right: 3px;
    }
  }
  .but {
    background: #ff676c;
    border: none;
    width: 80px;
    height: 30px;
  }
}
</style>
