<template>
  <div class="view-demo">
    <n-card title="TableLowcode2 视图演示" size="small">
      <template #header-extra>
        <n-space>
          <n-button size="small" type="primary" @click="showDemo = !showDemo">
            {{ showDemo ? '隐藏演示' : '显示演示' }}
          </n-button>
        </n-space>
      </template>
      
      <div v-if="showDemo" class="demo-content">
        <n-alert type="info" :show-icon="false" style="margin-bottom: 16px;">
          <strong>功能演示：</strong>
          <ol style="margin: 8px 0; padding-left: 20px;">
            <li>点击 "添加视图" 按钮 → 新视图自动创建完成</li>
            <li>配置面板自动打开</li>
            <li>修改配置 → 实时生效到表格</li>
          </ol>
        </n-alert>

        <n-steps :current="currentStep" size="small" style="margin-bottom: 16px;">
          <n-step title="点击添加视图" description="自动创建新视图" />
          <n-step title="配置面板打开" description="立即显示配置选项" />
          <n-step title="实时配置" description="修改立即生效" />
        </n-steps>

        <div class="demo-actions">
          <n-space>
            <n-button 
              type="primary" 
              @click="simulateAddView"
              :loading="isCreating"
            >
              <template #icon>
                <n-icon><AddIcon /></n-icon>
              </template>
              演示：添加视图
            </n-button>
            
            <n-button 
              @click="simulateConfigChange"
              :disabled="currentStep < 2"
            >
              <template #icon>
                <n-icon><SettingsIcon /></n-icon>
              </template>
              演示：修改配置
            </n-button>
            
            <n-button @click="resetDemo" quaternary>
              重置演示
            </n-button>
          </n-space>
        </div>

        <div v-if="demoMessages.length > 0" class="demo-messages">
          <n-timeline>
            <n-timeline-item
              v-for="(message, index) in demoMessages"
              :key="index"
              :type="message.type"
              :title="message.title"
              :content="message.content"
              :time="message.time"
            />
          </n-timeline>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NIcon } from 'naive-ui';
import { Add as AddIcon, Settings as SettingsIcon } from '@vicons/ionicons5';

const showDemo = ref(false);
const currentStep = ref(0);
const isCreating = ref(false);
const demoMessages = ref<Array<{
  type: string;
  title: string;
  content: string;
  time: string;
}>>([]);

const addMessage = (type: string, title: string, content: string) => {
  demoMessages.value.push({
    type,
    title,
    content,
    time: new Date().toLocaleTimeString()
  });
};

const simulateAddView = async () => {
  isCreating.value = true;
  currentStep.value = 1;
  
  addMessage('info', '步骤 1: 点击添加视图', '用户点击了添加视图按钮');
  
  // 模拟创建过程
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const timestamp = new Date().toLocaleString('zh-CN', { 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  const viewName = `视图_${timestamp}`;
  
  addMessage('success', '✅ 新视图创建完成', `视图"${viewName}"已自动创建`);
  
  currentStep.value = 2;
  addMessage('info', '步骤 2: 配置面板打开', '配置面板自动打开，可以开始配置');
  
  isCreating.value = false;
};

const simulateConfigChange = () => {
  currentStep.value = 3;
  addMessage('success', '✅ 配置实时生效', '修改配置后立即应用到表格，无需手动保存');
  
  // 模拟一些配置变化
  setTimeout(() => {
    addMessage('info', '配置变化示例', '表格标题已更新');
  }, 500);
  
  setTimeout(() => {
    addMessage('info', '配置变化示例', '列宽度已调整');
  }, 1000);
  
  setTimeout(() => {
    addMessage('info', '配置变化示例', '筛选条件已应用');
  }, 1500);
};

const resetDemo = () => {
  currentStep.value = 0;
  demoMessages.value = [];
  isCreating.value = false;
  addMessage('info', '演示重置', '演示已重置，可以重新开始');
};
</script>

<style scoped>
.view-demo {
  margin-bottom: 20px;
}

.demo-content {
  padding: 16px 0;
}

.demo-actions {
  margin: 16px 0;
}

.demo-messages {
  margin-top: 20px;
  max-height: 300px;
  overflow-y: auto;
}
</style>

