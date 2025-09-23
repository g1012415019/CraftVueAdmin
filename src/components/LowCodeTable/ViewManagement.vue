<template>
  <div class="flex items-center">
    <n-dropdown :options="viewOptions" @select="handleViewSelect">
      <n-button>Views</n-button>
    </n-dropdown>
    <n-button class="ml-2" @click="showSaveViewModal = true">Save View</n-button>
    <n-modal v-model:show="showSaveViewModal">
      <n-card style="width: 400px" title="Save View">
        <n-input v-model:value="newViewName" placeholder="Enter view name" />
        <template #footer>
          <n-button @click="handleSaveView">Save</n-button>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { NDropdown, NButton, NModal, NCard, NInput } from 'naive-ui';

  const props = defineProps({
    views: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
  });

  const emit = defineEmits(['save-view', 'select-view']);

  const showSaveViewModal = ref(false);
  const newViewName = ref('');

  const viewOptions = computed(() => {
    return Object.keys(props.views).map((name) => ({
      label: name,
      key: name,
    }));
  });

  function handleSaveView() {
    emit('save-view', newViewName.value);
    newViewName.value = '';
    showSaveViewModal.value = false;
  }

  function handleViewSelect(key: string) {
    emit('select-view', key);
  }
</script>
