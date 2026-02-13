<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-gray-700">
        {{ itemLabel || $t('admin.components.dataList.item') }}s ({{
          model.length
        }}<template v-if="maxItems">/{{ maxItems }}</template
        >)
      </span>
      <UButton
        icon="i-heroicons-plus"
        size="sm"
        :disabled="!!maxItems && model.length >= maxItems"
        @click="handleAdd"
      >
        {{
          addLabel ||
          $t('admin.components.dataList.addItem', {
            item: itemLabel || $t('admin.components.dataList.item'),
          })
        }}
      </UButton>
    </div>

    <!-- Empty state -->
    <div
      v-if="model.length === 0"
      class="text-center py-8 text-gray-400 border border-dashed rounded-lg"
    >
      <slot name="empty">
        <UIcon name="i-heroicons-inbox" class="w-8 h-8 mx-auto mb-2" />
        <p class="text-sm">
          {{ emptyMessage || $t('admin.components.dataList.empty') }}
        </p>
      </slot>
    </div>

    <!-- Items -->
    <div v-else class="space-y-4">
      <UCard v-for="(item, index) in model" :key="index">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">
              {{ itemLabel || $t('admin.components.dataList.item') }}
              {{ index + 1 }}
            </span>
            <div class="flex gap-2">
              <UButton
                icon="i-heroicons-chevron-up"
                size="xs"
                variant="ghost"
                color="neutral"
                :disabled="index === 0"
                :title="$t('admin.components.dataList.moveUp')"
                @click="moveUp(index)"
              />
              <UButton
                icon="i-heroicons-chevron-down"
                size="xs"
                variant="ghost"
                color="neutral"
                :disabled="index === model.length - 1"
                :title="$t('admin.components.dataList.moveDown')"
                @click="moveDown(index)"
              />
              <UButton
                icon="i-heroicons-trash"
                size="xs"
                variant="ghost"
                color="error"
                :disabled="model.length <= minItems"
                :title="$t('admin.components.dataList.removeItem')"
                @click="removeItem(index)"
              />
            </div>
          </div>
        </template>

        <slot :item="item" :index="index" />
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      maxItems?: number;
      minItems?: number;
      itemLabel?: string;
      addLabel?: string;
      emptyMessage?: string;
    }>(),
    {
      maxItems: 0,
      minItems: 0,
    },
  );

  const model = defineModel<any[]>({ default: () => [] });

  const emit = defineEmits<{
    add: [];
    remove: [index: number];
  }>();

  function handleAdd() {
    emit('add');
    // If parent doesn't handle add, push an empty object
    // Parent should listen to @add and push their own item shape
  }

  function removeItem(index: number) {
    emit('remove', index);
    model.value = model.value.filter((_, i) => i !== index);
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const arr = [...model.value];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    model.value = arr;
  }

  function moveDown(index: number) {
    if (index === model.value.length - 1) return;
    const arr = [...model.value];
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    model.value = arr;
  }
</script>
