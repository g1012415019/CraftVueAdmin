<template>
  <div>
    <low-code-table
      :columns="columns"
      :data-source="dataSource"
      :show-index="true"
      :show-selection="true"
      :actions="actions"
      :toolbar="true"
      :view-management="true"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  const columns = ref([
    {
      fieldKey: 'name',
      title: 'Name',
      sortable: true,
    },
    {
      fieldKey: 'sex',
      title: 'Sex',
      filterable: true,
    },
    {
      fieldKey: 'email',
      title: 'Email',
    },
    {
      fieldKey: 'city',
      title: 'City',
      sortable: true,
      filterable: true,
    },
    {
      fieldKey: 'status',
      title: 'Status',
      type: 'tag',
    },
    {
      fieldKey: 'avatar',
      title: 'Avatar',
      type: 'image',
    },
    {
      fieldKey: 'createDate',
      title: 'Create Date',
      sortable: true,
    },
  ]);

  const dataSource = ref({
    mode: 'api',
    apiUrl: '/api/table/list',
    responseMap: {
      list: 'list',
      total: 'itemCount',
    },
  });

  const actions = ref([
    {
      label: 'Edit',
      action: 'edit',
      onClick: (row) => {
        console.log('edit', row);
      },
    },
    {
      label: 'Delete',
      action: 'delete',
      onClick: (row) => {
        console.log('delete', row);
      },
    },
  ]);
</script>
