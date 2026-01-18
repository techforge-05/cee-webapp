<template>
  <UDropdownMenu :items="items">
    <UButton
      icon="i-heroicons-language"
      :label="currentLocale?.name"
      variant="ghost"
      trailing-icon="i-heroicons-chevron-down-20-solid"
    />
  </UDropdownMenu>
</template>

<script setup lang="ts">
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const router = useRouter()

const currentLocale = computed(() => {
  return locales.value.find(l => l.code === locale.value)
})

const items = computed(() => [
  locales.value.map(l => ({
    label: l.name,
    icon: locale.value === l.code ? 'i-heroicons-check-20-solid' : undefined,
    onClick: async () => {
      const path = switchLocalePath(l.code)
      await router.push(path)
    }
  }))
])
</script>
