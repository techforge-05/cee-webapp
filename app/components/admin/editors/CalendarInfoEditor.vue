<template>
  <div class="space-y-8">
    <!-- Calendar Manager Link -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
      <UIcon name="i-heroicons-calendar-days" class="w-12 h-12 text-blue-400 mx-auto mb-3" />
      <h2 class="text-lg font-semibold text-gray-700 mb-2">
        {{ $t('admin.editors.calendarInfo.title') }}
      </h2>
      <p class="text-gray-500 max-w-md mx-auto mb-4">
        {{ $t('admin.editors.calendarInfo.message') }}
      </p>
      <UButton :to="localePath('/admin/calendar')" icon="i-heroicons-arrow-right" trailing>
        {{ $t('admin.editors.calendarInfo.goToCalendar') }}
      </UButton>
    </div>

    <!-- Key Academic Periods Editor -->
    <GenericContentEditor
      v-if="schema"
      :schema="schema"
      :section-key="sectionKey"
      :page-slug="pageSlug"
    />
  </div>
</template>

<script setup lang="ts">
import { getEditorSchema } from '~/components/admin/editors/editorSchemas'
import GenericContentEditor from '~/components/admin/editors/GenericContentEditor.vue'

const props = defineProps<{
  sectionKey: string
  pageSlug: string
}>()

const localePath = useLocalePath()

const schema = computed(() => {
  return getEditorSchema(`${props.sectionKey}/${props.pageSlug}`)
})
</script>
