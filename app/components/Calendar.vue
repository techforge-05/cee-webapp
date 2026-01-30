<template>
  <div class="calendar-container">
    <!-- Calendar Header -->
    <div class="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-6">
      <!-- Month Dropdown -->
      <div class="w-full hidden md:flex justify-end md:w-auto">
        <USelect
          v-model="selectedMonthYear"
          :items="schoolYearMonths"
          value-key="value"
          @update:model-value="goToSelectedMonth"
          class="w-full md:w-64"
        />
      </div>
      <div
        class="flex flex-col md:flex-row items-center justify-center gap-4 mb-4"
      >
        <!-- Navigation Arrows and Current Month (Mobile & Desktop) -->
        <div class="flex items-center gap-2 md:gap-4 w-full md:w-auto">
          <UButton
            icon="i-heroicons-chevron-left"
            color="neutral"
            variant="ghost"
            @click="previousMonth"
            class="bg-revert text-black cursor-pointer hover:bg-gray-300 active:bg-gray-400"
          />
          <h2
            class="text-xl md:text-2xl font-bold text-gray-900 capitalize text-center flex-1 md:flex-none"
          >
            {{ currentMonthName }} {{ currentYear }}
          </h2>
          <UButton
            icon="i-heroicons-chevron-right"
            color="neutral"
            variant="ghost"
            @click="nextMonth"
            class="bg-revert text-black cursor-pointer hover:bg-gray-300 active:bg-gray-400"
          />
        </div>
      </div>

      <!-- View Toggle -->
      <div class="flex justify-center gap-2 mb-4">
        <UButton
          :variant="viewMode === 'month' ? 'solid' : 'outline'"
          color="secondary"
          size="sm"
          @click="viewMode = 'month'"
        >
          {{ $t('academics.calendar.monthView') }}
        </UButton>
        <UButton
          :variant="viewMode === 'list' ? 'solid' : 'outline'"
          color="secondary"
          size="sm"
          @click="viewMode = 'list'"
        >
          {{ $t('academics.calendar.listView') }}
        </UButton>
      </div>

      <!-- Event Type Filter -->
      <div class="flex flex-wrap gap-2 justify-center">
        <UButton
          v-for="type in eventTypes"
          :key="type.value"
          :variant="
            selectedEventTypes.includes(type.value) ? 'solid' : 'outline'
          "
          :color="type.color"
          size="xs"
          @click="toggleEventType(type.value)"
        >
          <UIcon :name="type.icon" class="w-4 h-4 mr-1" />
          {{ $t(`academics.calendar.eventTypes.${type.value}`) }}
        </UButton>
      </div>
    </div>

    <!-- Month View -->
    <div
      v-if="viewMode === 'month'"
      class="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <!-- Weekday Headers -->
      <div class="grid grid-cols-7 bg-gray-100 border-b">
        <div
          v-for="day in weekDays"
          :key="day"
          class="p-2 md:p-4 text-center font-semibold text-gray-700 text-sm md:text-base"
        >
          {{ $t(`academics.calendar.days.${day}`) }}
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="grid grid-cols-7 divide-x divide-y divide-gray-200">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          class="min-h-24 md:min-h-32 p-1 md:p-2"
          :class="{
            'bg-gray-50': !day.isCurrentMonth,
            'bg-blue-50': day.isToday,
          }"
        >
          <div
            class="text-right text-sm font-semibold mb-1"
            :class="{
              'text-gray-400': !day.isCurrentMonth,
              'text-blue-600': day.isToday,
              'text-gray-900': day.isCurrentMonth && !day.isToday,
            }"
          >
            {{ day.day }}
          </div>
          <div class="space-y-1">
            <div
              v-for="event in day.events"
              :key="event.id"
              class="text-xs px-1 py-0.5 rounded cursor-pointer truncate"
              :class="getEventClasses(event.event_type)"
              :title="locale === 'es' ? event.title_es : event.title_en"
              @click="selectEvent(event)"
            >
              {{ locale === 'es' ? event.title_es : event.title_en }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="space-y-4">
      <div
        v-for="event in filteredUpcomingEvents"
        :key="event.id"
        class="bg-white rounded-lg shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
        @click="selectEvent(event)"
      >
        <div class="flex items-start gap-4">
          <div
            class="shrink-0 w-16 h-16 rounded-lg flex flex-col items-center justify-center"
            :class="getEventBgClass(event.event_type)"
          >
            <div class="text-2xl font-bold text-white">
              {{ formatDay(event.start_date) }}
            </div>
            <div class="text-xs text-white uppercase">
              {{ formatMonth(event.start_date) }}
            </div>
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <UIcon
                :name="getEventIcon(event.event_type)"
                class="w-5 h-5"
                :class="getEventIconColor(event.event_type)"
              />
              <h3 class="text-xl font-bold text-gray-900">
                {{ locale === 'es' ? event.title_es : event.title_en }}
              </h3>
            </div>
            <p
              v-if="event.description_en || event.description_es"
              class="text-gray-700 mb-2"
            >
              {{
                locale === 'es' ? event.description_es : event.description_en
              }}
            </p>
            <div class="flex flex-wrap gap-3 text-sm text-gray-600">
              <div class="flex items-center gap-1">
                <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                {{ formatDateRange(event.start_date, event.end_date) }}
              </div>
              <div v-if="event.location" class="flex items-center gap-1">
                <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
                {{ event.location }}
              </div>
            </div>
          </div>
          <UBadge :color="getEventTypeColor(event.event_type)" size="lg">
            {{ $t(`academics.calendar.eventTypes.${event.event_type}`) }}
          </UBadge>
        </div>
      </div>

      <div v-if="filteredUpcomingEvents.length === 0" class="text-center py-12">
        <UIcon
          name="i-heroicons-calendar-days"
          class="w-16 h-16 text-gray-400 mx-auto mb-4"
        />
        <p class="text-xl text-gray-600">
          {{ $t('academics.calendar.noEvents') }}
        </p>
      </div>
    </div>

    <!-- Event Detail Modal -->
    <UModal v-model:open="showEventModal">
      <template #content>
        <div v-if="selectedEventData" class="p-6">
          <div class="flex items-start gap-4 mb-4">
            <div
              class="shrink-0 w-16 h-16 rounded-lg flex items-center justify-center"
              :class="getEventBgClass(selectedEventData.event_type)"
            >
              <UIcon
                :name="getEventIcon(selectedEventData.event_type)"
                class="w-8 h-8 text-white"
              />
            </div>
            <div class="flex-1">
              <h2
                class="text-2xl font-bold text-gray-900 mb-2 dark:text-gray-50"
              >
                {{
                  locale === 'es'
                    ? selectedEventData.title_es
                    : selectedEventData.title_en
                }}
              </h2>
              <UBadge :color="getEventTypeColor(selectedEventData.event_type)">
                {{
                  $t(
                    `academics.calendar.eventTypes.${selectedEventData.event_type}`,
                  )
                }}
              </UBadge>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <UIcon
                name="i-heroicons-calendar"
                class="w-5 h-5 text-gray-500 mt-0.5 dark:text-gray-50"
              />
              <div>
                <p class="font-semibold text-gray-900 dark:text-gray-50">
                  {{ $t('academics.calendar.date') }}
                </p>
                <p class="text-gray-700 dark:text-gray-50">
                  {{
                    formatDateRange(
                      selectedEventData.start_date,
                      selectedEventData.end_date,
                    )
                  }}
                </p>
              </div>
            </div>

            <div
              v-if="selectedEventData.location"
              class="flex items-start gap-3"
            >
              <UIcon
                name="i-heroicons-map-pin"
                class="w-5 h-5 text-gray-500 mt-0.5 dark:text-gray-50"
              />
              <div>
                <p class="font-semibold text-gray-900 dark:text-gray-50">
                  {{ $t('academics.calendar.location') }}
                </p>
                <p class="text-gray-700 dark:text-gray-50">
                  {{ selectedEventData.location }}
                </p>
              </div>
            </div>

            <div
              v-if="
                selectedEventData.description_en ||
                selectedEventData.description_es
              "
              class="flex items-start gap-3"
            >
              <UIcon
                name="i-heroicons-document-text"
                class="w-5 h-5 text-gray-500 mt-0.5 dark:text-gray-50"
              />
              <div>
                <p class="font-semibold text-gray-900 dark:text-gray-50">
                  {{ $t('academics.calendar.description') }}
                </p>
                <p class="text-gray-700 dark:text-gray-50">
                  {{
                    locale === 'es'
                      ? selectedEventData.description_es
                      : selectedEventData.description_en
                  }}
                </p>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <UButton @click="showEventModal = false">
              {{ $t('academics.calendar.close') }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
  const { locale } = useI18n();
  const supabase = useSupabaseClient();

  // Calendar state
  const currentDate = ref(new Date());
  const viewMode = ref<'month' | 'list'>('month');
  const selectedEventTypes = ref<string[]>([
    'holiday',
    'exam',
    'event',
    'no_school',
    'parent_meeting',
  ]);
  const showEventModal = ref(false);
  const selectedEventData = ref<any>(null);
  const selectedMonthYear = ref('');

  // Event types configuration
  const eventTypes = [
    { value: 'holiday', color: 'primary', icon: 'i-heroicons-sparkles' },
    { value: 'exam', color: 'warning', icon: 'i-heroicons-pencil-square' },
    { value: 'event', color: 'secondary', icon: 'i-heroicons-calendar-days' },
    { value: 'no_school', color: 'error', icon: 'i-heroicons-x-circle' },
    {
      value: 'parent_meeting',
      color: 'primary',
      icon: 'i-heroicons-user-group',
    },
  ];

  const weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  // Computed properties
  const currentMonth = computed(() => currentDate.value.getMonth());
  const currentYear = computed(() => currentDate.value.getFullYear());
  const currentMonthName = computed(() => {
    return new Date(
      currentYear.value,
      currentMonth.value,
      1,
    ).toLocaleDateString(locale.value === 'es' ? 'es-HN' : 'en-US', {
      month: 'long',
    });
  });

  // Generate school year months (July to June)
  const schoolYearMonths = computed(() => {
    const months = [];
    const currentSchoolYear =
      new Date().getMonth() >= 6
        ? new Date().getFullYear()
        : new Date().getFullYear() - 1;
    const startYear = currentSchoolYear;
    const endYear = currentSchoolYear + 1;

    // July to December of start year
    for (let month = 6; month < 12; month++) {
      const date = new Date(startYear, month, 1);
      const monthName = date.toLocaleDateString(
        locale.value === 'es' ? 'es-HN' : 'en-US',
        { month: 'long' },
      );
      months.push({
        value: `${startYear}-${month}`,
        label: `${monthName} ${startYear}`,
      });
    }

    // January to July of end year
    for (let month = 0; month <= 6; month++) {
      const date = new Date(endYear, month, 1);
      const monthName = date.toLocaleDateString(
        locale.value === 'es' ? 'es-HN' : 'en-US',
        { month: 'long' },
      );
      months.push({
        value: `${endYear}-${month}`,
        label: `${monthName} ${endYear}`,
      });
    }

    return months;
  });

  // Initialize selected month/year
  watchEffect(() => {
    selectedMonthYear.value = `${currentYear.value}-${currentMonth.value}`;
  });

  // Fetch events from database
  const { data: events } = await useAsyncData('calendar-events', async () => {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
    return data || [];
  });

  const calendarDays = computed(() => {
    const year = currentYear.value;
    const month = currentMonth.value;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const firstDayOfWeek = firstDay.getDay();
    const totalDays = lastDay.getDate();
    const today = new Date();

    const days: any[] = [];

    // Previous month days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevLastDay.getDate() - i);
      days.push({
        day: prevLastDay.getDate() - i,
        date: date,
        isCurrentMonth: false,
        isToday: false,
        events: getEventsForDate(date),
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i);
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      days.push({
        day: i,
        date: date,
        isCurrentMonth: true,
        isToday,
        events: getEventsForDate(date),
      });
    }

    // Next month days to fill grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        day: i,
        date: date,
        isCurrentMonth: false,
        isToday: false,
        events: getEventsForDate(date),
      });
    }

    return days;
  });

  const filteredUpcomingEvents = computed(() => {
    if (!events.value) return [];

    return events.value
      .filter((event: any) => {
        // Filter by selected event types
        if (!selectedEventTypes.value.includes(event.event_type)) return false;

        // Show events from today onwards
        const eventDate = new Date(event.start_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate >= today;
      })
      .slice(0, 50); // Limit to 50 upcoming events
  });
  // Methods
  function getEventsForDate(date: Date): any[] {
    if (!events.value) return [];

    const dateStr = date.toISOString().split('T')[0];

    return events.value.filter((event: any) => {
      if (!selectedEventTypes.value.includes(event.event_type)) return false;

      const eventStart = new Date(event.start_date);
      const eventEnd = event.end_date ? new Date(event.end_date) : eventStart;
      const checkDate = new Date(dateStr);

      return checkDate >= eventStart && checkDate <= eventEnd;
    });
  }

  function previousMonth() {
    currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1);
  }

  function nextMonth() {
    currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1);
  }

  function goToSelectedMonth(value: string) {
    const [year, month] = value.split('-').map(Number);
    currentDate.value = new Date(year, month, 1);
  }

  function toggleEventType(type: string) {
    const index = selectedEventTypes.value.indexOf(type);
    if (index > -1) {
      selectedEventTypes.value.splice(index, 1);
    } else {
      selectedEventTypes.value.push(type);
    }
  }

  function selectEvent(event: any) {
    selectedEventData.value = event;
    showEventModal.value = true;
  }

  function getEventClasses(type: string): string {
    const classes: Record<string, string> = {
      holiday: 'bg-red-100 text-red-800 border border-red-200',
      exam: 'bg-purple-100 text-purple-800 border border-purple-200',
      event: 'bg-blue-100 text-blue-800 border border-blue-200',
      no_school: 'bg-orange-100 text-orange-800 border border-orange-200',
      parent_meeting: 'bg-green-100 text-green-800 border border-green-200',
    };
    return classes[type] || 'bg-gray-100 text-gray-800';
  }

  function getEventBgClass(type: string): string {
    const classes: Record<string, string> = {
      holiday: 'bg-red-500',
      exam: 'bg-purple-500',
      event: 'bg-blue-500',
      no_school: 'bg-orange-500',
      parent_meeting: 'bg-green-500',
    };
    return classes[type] || 'bg-gray-500';
  }

  function getEventIcon(type: string): string {
    const icons: Record<string, string> = {
      holiday: 'i-heroicons-sparkles',
      exam: 'i-heroicons-pencil-square',
      event: 'i-heroicons-calendar-days',
      no_school: 'i-heroicons-x-circle',
      parent_meeting: 'i-heroicons-user-group',
    };
    return icons[type] || 'i-heroicons-calendar';
  }

  function getEventIconColor(type: string): string {
    const colors: Record<string, string> = {
      holiday: 'text-red-600',
      exam: 'text-purple-600',
      event: 'text-blue-600',
      no_school: 'text-orange-600',
      parent_meeting: 'text-green-600',
    };
    return colors[type] || 'text-gray-600';
  }

  function getEventTypeColor(type: string): string {
    const colors: Record<string, string> = {
      holiday: 'red',
      exam: 'purple',
      event: 'blue',
      no_school: 'orange',
      parent_meeting: 'green',
    };
    return colors[type] || 'gray';
  }

  function formatDay(dateStr: string): string {
    return new Date(dateStr).getDate().toString();
  }

  function formatMonth(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale.value === 'es' ? 'es-HN' : 'en-US', {
      month: 'short',
    });
  }

  function formatDateRange(startStr: string, endStr: string | null): string {
    const start = new Date(startStr);
    const localeStr = locale.value === 'es' ? 'es-HN' : 'en-US';

    if (!endStr || startStr === endStr) {
      return start.toLocaleDateString(localeStr, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }

    const end = new Date(endStr);
    return `${start.toLocaleDateString(localeStr, { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString(localeStr, { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }
</script>

<style scoped>
  .calendar-container {
    width: 100%;
  }
</style>
