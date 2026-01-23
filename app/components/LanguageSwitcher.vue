<template>
  <UDropdownMenu :items="items" :modal="false">
    <UButton
      icon="i-heroicons-language"
      :label="currentLocale?.name"
      variant="ghost"
      trailing-icon="i-heroicons-chevron-down-20-solid"
      class="text-gray-600 md:text-purple-700 cursor-pointer"
    />
    <template #item="{ item }">
      <div class="flex justify-between cursor-pointer">
        <div>{{ item.label }}</div>
        <UIcon
          v-if="item['trailing-icon']"
          name="i-heroicons-check-20-solid"
          class="shrink-0 size-5 text-primary"
        />
      </div>
    </template>
  </UDropdownMenu>
</template>

<script setup lang="ts">
  const { locale, locales } = useI18n();
  const switchLocalePath = useSwitchLocalePath();
  const router = useRouter();

  const currentLocale = computed(() => {
    return locales.value.find((l) => l.code === locale.value);
  });

  const items = computed(() => [
    locales.value.map((l) => ({
      label: l.name,
      'trailing-icon':
        locale.value === l.code ? 'i-heroicons-check-20-solid' : undefined,
      onClick: async () => {
        const path = switchLocalePath(l.code);
        await router.push(path);
      },
    })),
  ]);
</script>
