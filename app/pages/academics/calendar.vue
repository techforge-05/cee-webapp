<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('academics.calendar.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-blue-100">
          {{ $t('academics.calendar.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Introduction -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <UIcon
            name="i-heroicons-calendar-days"
            class="w-16 h-16 text-purple-600 mx-auto mb-6"
          />
          <p class="text-xl text-gray-700 leading-relaxed">
            {{ $t('academics.calendar.intro') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Calendar Component -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Calendar />
      </div>
    </section>

    <!-- Important Dates Section -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">
          {{ $t('academics.calendar.importantDates.title') }}
        </h2>
        <div class="flex flex-wrap justify-center gap-8">
          <div
            v-for="(item, index) in importantDates"
            :key="index"
            class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 w-full md:w-[calc(33.333%-1.334rem)]"
          >
            <div
              class="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              :class="getDateBgColor(index)"
            >
              <UIcon :name="item.icon" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              {{ item.title }}
            </h3>
            <p class="text-gray-700">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Download/Print Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="bg-blue-50 rounded-lg p-8 md:p-12 max-w-4xl mx-auto">
          <div class="text-center">
            <UIcon
              name="i-heroicons-arrow-down-tray"
              class="w-12 h-12 text-blue-600 mx-auto mb-6"
            />
            <h2 class="text-3xl font-bold text-blue-900 mb-4">
              {{ $t('academics.calendar.download.title') }}
            </h2>
            <p class="text-xl text-gray-800 mb-6">
              {{ $t('academics.calendar.download.description') }}
            </p>
            <div class="flex justify-center">
              <UButton
                size="lg"
                icon="i-heroicons-document-arrow-down"
                color="secondary"
                @click="showDownloadModal = true"
              >
                {{ $t('academics.calendar.download.pdf') }}
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Download Modal -->
    <UModal v-model:open="showDownloadModal">
      <template #header>
        <h3 class="text-lg font-semibold">
          {{ $t('academics.calendar.download.modalTitle') }}
        </h3>
      </template>
      <template #body>
        <div class="space-y-4 p-4">
          <UFormField :label="$t('academics.calendar.download.eventTypeLabel')">
            <USelect
              v-model="selectedEventType"
              :items="eventTypeOptions"
              class="w-full"
            />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton
            variant="ghost"
            @click="showDownloadModal = false"
          >
            {{ $t('academics.calendar.download.cancel') }}
          </UButton>
          <UButton
            icon="i-heroicons-document-arrow-down"
            :loading="generatingPdf"
            @click="generatePdf"
          >
            {{ $t('academics.calendar.download.downloadButton') }}
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Call to Action -->
    <section
      class="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4">
            {{ $t('academics.calendar.cta.title') }}
          </h2>
          <p class="text-xl mb-8">
            {{ $t('academics.calendar.cta.description') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              :to="localePath('/admissions/who-can-apply')"
              size="lg"
              variant="solid"
              class="bg-white text-blue-700 hover:bg-gray-100 justify-center"
            >
              {{ $t('academics.calendar.cta.learnMore') }}
            </UButton>
            <UButton
              :to="localePath('/contact/info')"
              size="lg"
              variant="outline"
              class="border-2 border-white text-white hover:bg-white hover:text-blue-700 justify-center"
            >
              {{ $t('academics.calendar.cta.contactUs') }}
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { EVENT_TYPES } from '~/composables/useCalendarAdmin';

  const localePath = useLocalePath();
  const { locale, t, tm, rt } = useI18n();
  const { loadContent, getItems, field } = usePublicContent();
  const supabase = useSupabaseClient();

  onMounted(() => loadContent([
    'academics.calendar.importantDates',
  ]));

  // --- Important Dates ---
  const importantDateIcons = [
    'i-heroicons-calendar',
    'i-heroicons-book-open',
    'i-heroicons-sparkles',
  ];

  const importantDates = computed(() => {
    const dbItems = getItems('academics.calendar.importantDates');
    if (dbItems.length > 0) {
      return dbItems.map((item, index) => ({
        title: field(item, 'title'),
        description: field(item, 'description'),
        icon: field(item, 'icon') || importantDateIcons[index % importantDateIcons.length],
      }));
    }
    const items = tm('academics.calendar.importantDates.items') as any[];
    if (!Array.isArray(items)) return [];
    return items.map((item: any, index: number) => ({
      title: typeof item.title === 'string' ? item.title : rt(item.title),
      description: typeof item.description === 'string' ? item.description : rt(item.description),
      icon: importantDateIcons[index % importantDateIcons.length],
    }));
  });

  const getDateBgColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-indigo-500'];
    return colors[index % colors.length];
  };

  // --- PDF Download Modal ---
  const showDownloadModal = ref(false);
  const selectedEventType = ref('all');
  const generatingPdf = ref(false);

  const eventTypeOptions = computed(() => {
    const allOption = {
      value: 'all',
      label: t('academics.calendar.download.allEvents'),
    };
    const types = EVENT_TYPES.map((et) => ({
      value: et.value,
      label: t(`academics.calendar.eventTypes.${et.value}`),
    }));
    return [allOption, ...types];
  });

  function getSchoolYearRange() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const startYear = currentMonth >= 7 ? currentYear : currentYear - 1;
    const endYear = startYear + 1;
    return {
      start: `${startYear}-07-01`,
      end: `${endYear}-06-30`,
      label: `${startYear}-${endYear}`,
    };
  }

  function formatEventDate(startStr: string, endStr: string | null): string {
    const localeStr = locale.value === 'es' ? 'es-HN' : 'en-US';
    const start = new Date(startStr + 'T00:00:00');

    if (!endStr || startStr === endStr) {
      return start.toLocaleDateString(localeStr, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }

    const end = new Date(endStr + 'T00:00:00');
    const startFmt = start.toLocaleDateString(localeStr, { month: 'short', day: 'numeric' });
    const endFmt = end.toLocaleDateString(localeStr, { month: 'short', day: 'numeric', year: 'numeric' });
    return `${startFmt} - ${endFmt}`;
  }

  function loadImage(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d')!.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  async function generatePdf() {
    generatingPdf.value = true;

    try {
      // Fetch events from database
      const schoolYear = getSchoolYearRange();
      let query = supabase
        .from('calendar_events')
        .select('*')
        .gte('start_date', schoolYear.start)
        .lte('start_date', schoolYear.end)
        .order('start_date', { ascending: true });

      if (selectedEventType.value !== 'all') {
        query = query.eq('event_type', selectedEventType.value);
      }

      const { data: events } = await query;

      // Dynamic import to avoid SSR issues
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;

      // --- Logo ---
      try {
        const logoData = await loadImage('/images/logo.png');
        const logoSize = 25;
        doc.addImage(logoData, 'PNG', (pageWidth - logoSize) / 2, 12, logoSize, logoSize);
      } catch {
        // Logo failed to load, continue without it
      }

      // --- Title ---
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text(t('academics.calendar.download.pdfTitle'), pageWidth / 2, 46, { align: 'center' });

      // --- School Year ---
      doc.setFontSize(13);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `${t('academics.calendar.download.schoolYear')} ${schoolYear.label}`,
        pageWidth / 2,
        54,
        { align: 'center' },
      );

      // --- Generated date ---
      const localeStr = locale.value === 'es' ? 'es-HN' : 'en-US';
      const generatedDate = new Date().toLocaleDateString(localeStr, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `${t('academics.calendar.download.generatedOn')}: ${generatedDate}`,
        pageWidth / 2,
        61,
        { align: 'center' },
      );

      // --- Filter label ---
      const filterLabel = selectedEventType.value === 'all'
        ? t('academics.calendar.download.allEvents')
        : t(`academics.calendar.eventTypes.${selectedEventType.value}`);
      doc.text(
        `${t('academics.calendar.download.showing')}: ${filterLabel}`,
        pageWidth / 2,
        67,
        { align: 'center' },
      );

      // --- Divider line ---
      doc.setDrawColor(180, 180, 180);
      doc.line(margin, 72, pageWidth - margin, 72);

      let y = 80;

      if (!events || events.length === 0) {
        // No events message
        doc.setFontSize(14);
        doc.setTextColor(120, 120, 120);
        doc.setFont('helvetica', 'italic');
        doc.text(
          t('academics.calendar.download.noEvents'),
          pageWidth / 2,
          y + 20,
          { align: 'center' },
        );
      } else {
        // --- Table header ---
        const colDate = margin;
        const colEvent = margin + 48;
        const colType = margin + 115;
        const dateColW = 46;
        const eventColW = 65;
        const typeColW = contentWidth - dateColW - eventColW;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(60, 60, 60);
        doc.setFillColor(240, 240, 245);
        doc.rect(margin, y - 5, contentWidth, 8, 'F');
        doc.text(t('academics.calendar.download.dateColumn'), colDate + 2, y);
        doc.text(t('academics.calendar.download.eventColumn'), colEvent + 2, y);
        doc.text(t('academics.calendar.download.typeColumn'), colType + 2, y);

        y += 8;

        // --- Table rows ---
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);

        for (const event of events) {
          const eventTitle = locale.value === 'es' ? event.title_es : event.title_en;
          const eventDate = formatEventDate(event.start_date, event.end_date);
          const eventType = t(`academics.calendar.eventTypes.${event.event_type}`);

          // Wrap long text
          const titleLines = doc.splitTextToSize(eventTitle, eventColW - 4);
          const dateLines = doc.splitTextToSize(eventDate, dateColW - 4);
          const rowHeight = Math.max(titleLines.length, dateLines.length) * 4.5 + 3;

          // Check if we need a new page
          if (y + rowHeight > pageHeight - 30) {
            doc.addPage();
            y = 20;
          }

          // Alternate row background
          const rowIndex = events.indexOf(event);
          if (rowIndex % 2 === 0) {
            doc.setFillColor(250, 250, 252);
            doc.rect(margin, y - 3.5, contentWidth, rowHeight, 'F');
          }

          doc.setTextColor(50, 50, 50);
          doc.text(dateLines, colDate + 2, y);
          doc.text(titleLines, colEvent + 2, y);
          doc.text(eventType, colType + 2, y);

          y += rowHeight;
        }
      }

      // --- Disclaimer ---
      // Ensure disclaimer fits on the page
      const disclaimerText = t('academics.calendar.download.disclaimer');
      doc.setFontSize(8);
      const disclaimerLines = doc.splitTextToSize(disclaimerText, contentWidth);
      const disclaimerHeight = disclaimerLines.length * 3.5 + 8;

      if (y + disclaimerHeight + 10 > pageHeight) {
        doc.addPage();
        y = 20;
      } else {
        y = Math.max(y + 15, pageHeight - disclaimerHeight - 15);
      }

      doc.setDrawColor(180, 180, 180);
      doc.line(margin, y - 3, pageWidth - margin, y - 3);
      doc.setTextColor(130, 130, 130);
      doc.setFont('helvetica', 'italic');
      doc.text(disclaimerLines, pageWidth / 2, y + 2, { align: 'center' });

      doc.save('cee-academic-calendar.pdf');
      showDownloadModal.value = false;
    } catch (e) {
      console.error('PDF generation failed:', e);
    } finally {
      generatingPdf.value = false;
    }
  }

  // Set page metadata
  useHead({
    title: 'Academic Calendar - CEE',
    meta: [
      {
        name: 'description',
        content:
          'View the academic calendar for CEE with important dates, holidays, exams, and school events throughout the year.',
      },
    ],
  });
</script>
