<template> 11 </template>

<script lang="ts">
  export default { name: 'DashboardConsole' };
</script>

<style lang="less" scoped>
  .data-card {
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
    }

    .data-card-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .data-icon {
      width: 64px;
      height: 64px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;

      &.blue {
        background: linear-gradient(135deg, #1890ff, #096dd9);
      }

      &.green {
        background: linear-gradient(135deg, #52c41a, #389e0d);
      }

      &.red {
        background: linear-gradient(135deg, #ff4d4f, #cf1322);
      }

      &.orange {
        background: linear-gradient(135deg, #faad14, #d48806);
      }
    }

    .data-info {
      flex: 1;
    }

    .data-title {
      font-size: 14px;
      color: rgb(0 0 0 / 45%);
      margin-bottom: 4px;
    }

    .data-value {
      font-size: 28px;
      font-weight: 600;
      color: rgb(0 0 0 / 85%);
      margin-bottom: 4px;
    }

    .data-growth {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;

      .growth-text {
        color: #52c41a;

        &.negative {
          color: #ff4d4f;
        }
      }
    }
  }

  .chart-container {
    height: 300px;
  }

  .chart {
    width: 100%;
    height: 100%;
  }

  .quick-action {
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
    }
  }
</style>
