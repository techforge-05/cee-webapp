export interface EditorField {
  key: string
  labelKey: string
  type: 'text' | 'textarea' | 'metadata' | 'icon' | 'select'
  maxLength?: number
  rows?: number
  options?: { value: string; labelKey: string }[]
  halfWidth?: boolean
  placeholder?: string
}

export interface EditorSection {
  pageKey: string
  labelKey: string
  type: 'single' | 'list' | 'info'
  defaultOpen?: boolean
  fields: EditorField[]
  maxItems?: number
  minItems?: number
  itemLabelKey?: string
  /** For type 'info': icon name, description i18n key, link path, link label i18n key */
  infoIcon?: string
  infoDescriptionKey?: string
  infoLinkTo?: string
  infoLinkLabelKey?: string
}

// --- Field shorthand helpers ---
const f = {
  title: (labelKey = 'admin.editors.generic.title'): EditorField => ({
    key: 'title',
    labelKey,
    type: 'text',
    maxLength: 150,
  }),
  name: (labelKey = 'admin.editors.generic.name'): EditorField => ({
    key: 'name',
    labelKey,
    type: 'text',
    maxLength: 100,
  }),
  description: (labelKey = 'admin.editors.generic.description', rows = 3): EditorField => ({
    key: 'description',
    labelKey,
    type: 'textarea',
    rows,
    maxLength: 1000,
  }),
  content: (labelKey = 'admin.editors.generic.content', rows = 5): EditorField => ({
    key: 'content',
    labelKey,
    type: 'textarea',
    rows,
    maxLength: 2000,
  }),
  text: (labelKey = 'admin.editors.generic.text'): EditorField => ({
    key: 'text',
    labelKey,
    type: 'textarea',
    rows: 3,
    maxLength: 1000,
  }),
  statement: (labelKey = 'admin.editors.generic.statement'): EditorField => ({
    key: 'statement',
    labelKey,
    type: 'textarea',
    rows: 5,
    maxLength: 2000,
  }),
  paragraph1: (): EditorField => ({
    key: 'paragraph1',
    labelKey: 'admin.editors.generic.paragraph1',
    type: 'textarea',
    rows: 3,
    maxLength: 1000,
  }),
  paragraph2: (): EditorField => ({
    key: 'paragraph2',
    labelKey: 'admin.editors.generic.paragraph2',
    type: 'textarea',
    rows: 3,
    maxLength: 1000,
  }),
  icon: (labelKey = 'admin.editors.generic.icon'): EditorField => ({
    key: 'icon',
    labelKey,
    type: 'icon',
  }),
  meta: (key: string, labelKey: string, maxLength = 200, placeholder?: string): EditorField => ({
    key,
    labelKey,
    type: 'metadata',
    maxLength,
    ...(placeholder && { placeholder }),
  }),
}

// --- Schemas ---

const schemas: Record<string, EditorSection[]> = {
  // ==================== ABOUT ====================

  'about/mission-vision-values': [
    {
      pageKey: 'about.mvv.intro',
      labelKey: 'admin.editors.about.mvv.intro',
      type: 'single',
      defaultOpen: false,
      fields: [f.title(), f.paragraph1(), f.paragraph2(), f.meta('imageUrl', 'admin.editors.generic.imageUrl')],
    },
    {
      pageKey: 'about.mvv.mission',
      labelKey: 'admin.editors.about.mvv.mission',
      type: 'single',
      fields: [f.title(), f.statement()],
    },
    {
      pageKey: 'about.mvv.vision',
      labelKey: 'admin.editors.about.mvv.vision',
      type: 'single',
      fields: [f.title(), f.statement()],
    },
    {
      pageKey: 'about.mvv.values',
      labelKey: 'admin.editors.about.mvv.values',
      type: 'list',
      maxItems: 10,
      minItems: 3,
      itemLabelKey: 'admin.editors.about.mvv.value',
      fields: [f.title(), f.description(), { key: 'icon', labelKey: 'admin.editors.generic.icon', type: 'icon' }],
    },
  ],

  'about/statement-of-faith': [
    {
      pageKey: 'about.sof.intro',
      labelKey: 'admin.editors.about.sof.intro',
      type: 'single',
      defaultOpen: false,
      fields: [f.text()],
    },
    {
      pageKey: 'about.sof.beliefs',
      labelKey: 'admin.editors.about.sof.beliefs',
      type: 'list',
      maxItems: 15,
      minItems: 5,
      itemLabelKey: 'admin.editors.about.sof.belief',
      fields: [f.title(), f.content(), { key: 'icon', labelKey: 'admin.editors.generic.icon', type: 'icon' }],
    },
    {
      pageKey: 'about.sof.closing',
      labelKey: 'admin.editors.about.sof.closing',
      type: 'single',
      fields: [f.text()],
    },
  ],

  'about/philosophy': [
    {
      pageKey: 'about.philosophy.intro',
      labelKey: 'admin.editors.about.philosophy.intro',
      type: 'single',
      defaultOpen: false,
      fields: [f.text()],
    },
    {
      pageKey: 'about.philosophy.biblical',
      labelKey: 'admin.editors.about.philosophy.biblical',
      type: 'single',
      fields: [f.title(), f.content(), { key: 'icon', labelKey: 'admin.editors.generic.icon', type: 'icon' }],
    },
    {
      pageKey: 'about.philosophy.dignity',
      labelKey: 'admin.editors.about.philosophy.dignity',
      type: 'single',
      fields: [f.title(), f.content(), { key: 'icon', labelKey: 'admin.editors.generic.icon', type: 'icon' }],
    },
    {
      pageKey: 'about.philosophy.bilingual',
      labelKey: 'admin.editors.about.philosophy.bilingual',
      type: 'single',
      fields: [f.title(), f.content(), { key: 'icon', labelKey: 'admin.editors.generic.icon', type: 'icon' }],
    },
    {
      pageKey: 'about.philosophy.principles',
      labelKey: 'admin.editors.about.philosophy.principles',
      type: 'list',
      maxItems: 5,
      minItems: 2,
      itemLabelKey: 'admin.editors.generic.principle',
      fields: [f.title(), f.description(), { key: 'icon', labelKey: 'admin.editors.generic.icon', type: 'icon' }],
    },
  ],

  'about/history': [
    {
      pageKey: 'about.history.intro',
      labelKey: 'admin.editors.about.history.intro',
      type: 'single',
      defaultOpen: false,
      fields: [f.text()],
    },
    {
      pageKey: 'about.history.timeline',
      labelKey: 'admin.editors.about.history.timeline',
      type: 'list',
      maxItems: 12,
      minItems: 4,
      itemLabelKey: 'admin.editors.about.history.period',
      fields: [f.title(), f.content(), { key: 'icon', labelKey: 'admin.editors.generic.icon', type: 'icon' }],
    },
    {
      pageKey: 'about.history.legacy',
      labelKey: 'admin.editors.about.history.legacy',
      type: 'single',
      fields: [f.title(), f.content(), { key: 'icon', labelKey: 'admin.editors.generic.icon', type: 'icon' }],
    },
  ],

  'about/town': [
    {
      pageKey: 'about.town.intro',
      labelKey: 'admin.editors.about.town.intro',
      type: 'single',
      defaultOpen: false,
      fields: [f.title(), f.paragraph1(), f.paragraph2(), f.meta('imageUrl', 'admin.editors.generic.imageUrl')],
    },
    {
      pageKey: 'about.town.location',
      labelKey: 'admin.editors.about.town.location',
      type: 'list',
      maxItems: 8,
      minItems: 2,
      itemLabelKey: 'admin.editors.generic.item',
      fields: [f.text()],
    },
    {
      pageKey: 'about.town.climate',
      labelKey: 'admin.editors.about.town.climate',
      type: 'single',
      fields: [f.title(), f.description()],
    },
    {
      pageKey: 'about.town.climateItems',
      labelKey: 'admin.editors.about.town.climateItems',
      type: 'list',
      maxItems: 6,
      minItems: 1,
      itemLabelKey: 'admin.editors.generic.item',
      fields: [f.text()],
    },
    {
      pageKey: 'about.town.mountainImage',
      labelKey: 'admin.editors.about.town.mountainImage',
      type: 'single',
      fields: [
        { key: 'alt', labelKey: 'admin.editors.generic.altText', type: 'text', maxLength: 200 },
        f.meta('imageUrl', 'admin.editors.generic.imageUrl'),
      ],
    },
    {
      pageKey: 'about.town.activities',
      labelKey: 'admin.editors.about.town.activities',
      type: 'list',
      maxItems: 8,
      minItems: 3,
      itemLabelKey: 'admin.editors.generic.activity',
      fields: [f.title(), f.description(), { key: 'icon', labelKey: 'admin.editors.generic.icon', type: 'icon' }],
    },
    {
      pageKey: 'about.town.gallery',
      labelKey: 'admin.editors.about.town.gallery',
      type: 'list',
      maxItems: 6,
      minItems: 1,
      itemLabelKey: 'admin.editors.about.town.galleryItem',
      fields: [
        { key: 'alt', labelKey: 'admin.editors.generic.altText', type: 'text', maxLength: 200 },
        f.meta('imageUrl', 'admin.editors.generic.imageUrl'),
      ],
    },
  ],

  // ==================== ACADEMICS ====================

  'academics/curriculum': [
    {
      pageKey: 'academics.curriculum.intro',
      labelKey: 'admin.editors.academics.curriculum.intro',
      type: 'single',
      defaultOpen: false,
      fields: [f.title(), f.paragraph1(), f.paragraph2()],
    },
    {
      pageKey: 'academics.curriculum.kindergarten',
      labelKey: 'admin.editors.academics.curriculum.kindergarten',
      type: 'single',
      fields: [
        f.name(),
        f.description(),
        { key: 'details', labelKey: 'admin.editors.generic.details', type: 'textarea', rows: 3, maxLength: 500 },
      ],
    },
    {
      pageKey: 'academics.curriculum.elementary',
      labelKey: 'admin.editors.academics.curriculum.elementary',
      type: 'single',
      fields: [f.name(), f.description()],
    },
    {
      pageKey: 'academics.curriculum.elementarySubjects',
      labelKey: 'admin.editors.academics.curriculum.elementarySubjects',
      type: 'list',
      maxItems: 15,
      minItems: 3,
      itemLabelKey: 'admin.editors.generic.subject',
      fields: [{ key: 'text', labelKey: 'admin.editors.generic.text', type: 'text', maxLength: 200 }],
    },
    {
      pageKey: 'academics.curriculum.secondary',
      labelKey: 'admin.editors.academics.curriculum.secondary',
      type: 'single',
      fields: [f.name(), f.description()],
    },
    {
      pageKey: 'academics.curriculum.secondarySubjects79',
      labelKey: 'admin.editors.academics.curriculum.subjects79',
      type: 'list',
      maxItems: 20,
      minItems: 2,
      itemLabelKey: 'admin.editors.generic.subject',
      fields: [{ key: 'text', labelKey: 'admin.editors.generic.text', type: 'text', maxLength: 200 }],
    },
    {
      pageKey: 'academics.curriculum.secondarySubjects1011',
      labelKey: 'admin.editors.academics.curriculum.subjects1011',
      type: 'list',
      maxItems: 20,
      minItems: 2,
      itemLabelKey: 'admin.editors.generic.subject',
      fields: [{ key: 'text', labelKey: 'admin.editors.generic.text', type: 'text', maxLength: 200 }],
    },
    {
      pageKey: 'academics.curriculum.benefits',
      labelKey: 'admin.editors.academics.curriculum.benefits',
      type: 'list',
      maxItems: 5,
      minItems: 2,
      itemLabelKey: 'admin.editors.generic.benefit',
      fields: [f.title(), f.description(), { key: 'icon', labelKey: 'admin.editors.generic.icon', type: 'icon' }],
    },
  ],

  'academics/grades': [
    {
      pageKey: 'academics.grades.intro',
      labelKey: 'admin.editors.academics.grades.intro',
      type: 'single',
      defaultOpen: false,
      fields: [f.text()],
    },
    {
      pageKey: 'academics.grades.levels',
      labelKey: 'admin.editors.academics.grades.levels',
      type: 'list',
      maxItems: 6,
      minItems: 3,
      itemLabelKey: 'admin.editors.academics.grades.level',
      fields: [
        f.title(),
        { key: 'grades', labelKey: 'admin.editors.academics.grades.gradeRange', type: 'text', maxLength: 50 },
        f.description(),
        { key: 'focus', labelKey: 'admin.editors.academics.grades.focusAreas', type: 'textarea', rows: 4, maxLength: 500 },
        { key: 'ageRange', labelKey: 'admin.editors.academics.grades.ageRange', type: 'text', maxLength: 30 },
        { key: 'icon', labelKey: 'admin.editors.generic.icon', type: 'icon' },
      ],
    },
    {
      pageKey: 'academics.grades.specialPrograms',
      labelKey: 'admin.editors.academics.grades.specialPrograms',
      type: 'list',
      maxItems: 8,
      minItems: 3,
      itemLabelKey: 'admin.editors.generic.program',
      fields: [f.title(), f.description(), { key: 'icon', labelKey: 'admin.editors.generic.icon', type: 'icon' }],
    },
    {
      pageKey: 'academics.grades.approach',
      labelKey: 'admin.editors.academics.grades.approach',
      type: 'list',
      maxItems: 5,
      minItems: 2,
      itemLabelKey: 'admin.editors.generic.approach',
      fields: [f.title(), f.description(), { key: 'icon', labelKey: 'admin.editors.generic.icon', type: 'icon' }],
    },
  ],

  'academics/calendar': [
    {
      pageKey: 'academics.calendar.importantDates',
      labelKey: 'admin.editors.academics.calendar.importantDates',
      type: 'list',
      maxItems: 6,
      minItems: 2,
      itemLabelKey: 'admin.editors.generic.period',
      fields: [f.title(), f.description(), { key: 'icon', labelKey: 'admin.editors.generic.icon', type: 'icon' }],
    },
  ],

  'academics/guidance-wellbeing': [
    {
      pageKey: 'academics.guidance.intro',
      labelKey: 'admin.editors.academics.guidance.intro',
      type: 'single',
      defaultOpen: false,
      fields: [f.title(), f.description()],
    },
    {
      pageKey: 'academics.guidance.staff',
      labelKey: 'admin.editors.academics.guidance.staff',
      type: 'list',
      maxItems: 10,
      minItems: 1,
      itemLabelKey: 'admin.editors.academics.guidance.staffMember',
      fields: [
        f.name(),
        { key: 'position', labelKey: 'admin.editors.generic.position', type: 'text', maxLength: 100 },
        { key: 'email', labelKey: 'admin.editors.generic.email', type: 'text', maxLength: 100 },
        f.meta('imageUrl', 'admin.editors.generic.imageUrl'),
      ],
    },
    {
      pageKey: 'academics.guidance.services',
      labelKey: 'admin.editors.academics.guidance.services',
      type: 'list',
      maxItems: 5,
      minItems: 1,
      itemLabelKey: 'admin.editors.generic.service',
      fields: [f.title(), f.description(), { key: 'icon', labelKey: 'admin.editors.generic.icon', type: 'icon' }],
    },
    {
      pageKey: 'academics.guidance.images',
      labelKey: 'admin.editors.academics.guidance.images',
      type: 'list',
      maxItems: 6,
      minItems: 0,
      itemLabelKey: 'admin.editors.generic.image',
      fields: [
        { key: 'alt', labelKey: 'admin.editors.generic.altText', type: 'text', maxLength: 200 },
        f.meta('imageUrl', 'admin.editors.generic.imageUrl'),
      ],
    },
  ],

  // ==================== STUDENT LIFE ====================

  'studentLife/sports-clubs': [
    {
      pageKey: 'studentLife.sports.intro',
      labelKey: 'admin.editors.studentLife.sports.intro',
      type: 'single',
      defaultOpen: false,
      fields: [f.title(), f.description()],
    },
    {
      pageKey: 'studentLife.sports.items',
      labelKey: 'admin.editors.studentLife.sports.items',
      type: 'list',
      maxItems: 8,
      minItems: 2,
      itemLabelKey: 'admin.editors.studentLife.sports.sport',
      fields: [f.title(), f.description(), f.meta('imageUrl', 'admin.editors.generic.imageUrl')],
    },
    {
      pageKey: 'studentLife.sports.otherSports',
      labelKey: 'admin.editors.studentLife.sports.otherSports',
      type: 'single',
      fields: [f.text()],
    },
  ],

  'studentLife/service-projects': [
    {
      pageKey: 'studentLife.serviceProjects.intro',
      labelKey: 'admin.editors.studentLife.serviceProjects.intro',
      type: 'single',
      defaultOpen: false,
      fields: [f.text()],
    },
    {
      pageKey: 'studentLife.serviceProjects.benefits',
      labelKey: 'admin.editors.studentLife.serviceProjects.benefits',
      type: 'list',
      maxItems: 6,
      minItems: 2,
      itemLabelKey: 'admin.editors.generic.benefit',
      fields: [f.title(), f.description(), { key: 'icon', labelKey: 'admin.editors.generic.icon', type: 'icon' }],
    },
    {
      pageKey: 'studentLife.serviceProjects.items',
      labelKey: 'admin.editors.studentLife.serviceProjects.projects',
      type: 'list',
      maxItems: 8,
      minItems: 2,
      itemLabelKey: 'admin.editors.generic.project',
      fields: [f.title(), f.description(), { key: 'icon', labelKey: 'admin.editors.generic.icon', type: 'icon' }],
    },
  ],

  'studentLife/library': [
    {
      pageKey: 'studentLife.library.intro',
      labelKey: 'admin.editors.studentLife.library.intro',
      type: 'single',
      defaultOpen: false,
      fields: [f.text()],
    },
    {
      pageKey: 'studentLife.library.purpose',
      labelKey: 'admin.editors.studentLife.library.purpose',
      type: 'single',
      fields: [f.title(), f.description(), f.meta('imageUrl', 'admin.editors.generic.imageUrl')],
    },
    {
      pageKey: 'studentLife.library.goals',
      labelKey: 'admin.editors.studentLife.library.goals',
      type: 'list',
      maxItems: 8,
      minItems: 3,
      itemLabelKey: 'admin.editors.generic.goal',
      fields: [f.text()],
    },
    {
      pageKey: 'studentLife.library.readingCorner',
      labelKey: 'admin.editors.studentLife.library.readingCorner',
      type: 'single',
      fields: [f.title(), f.description(), f.meta('imageUrl', 'admin.editors.generic.imageUrl')],
    },
    {
      pageKey: 'studentLife.library.hours',
      labelKey: 'admin.editors.studentLife.library.hours',
      type: 'list',
      maxItems: 7,
      minItems: 1,
      itemLabelKey: 'admin.editors.generic.schedule',
      fields: [
        { key: 'day', labelKey: 'admin.editors.generic.day', type: 'text', maxLength: 50 },
        { key: 'hours', labelKey: 'admin.editors.generic.hours', type: 'text', maxLength: 100 },
      ],
    },
    {
      pageKey: 'studentLife.library.gradeSupport',
      labelKey: 'admin.editors.studentLife.library.gradeSupport',
      type: 'list',
      maxItems: 5,
      minItems: 2,
      itemLabelKey: 'admin.editors.academics.grades.level',
      fields: [f.title(), f.description(), f.meta('imageUrl', 'admin.editors.generic.imageUrl')],
    },
    {
      pageKey: 'studentLife.library.rules',
      labelKey: 'admin.editors.studentLife.library.rules',
      type: 'list',
      maxItems: 10,
      minItems: 3,
      itemLabelKey: 'admin.editors.generic.rule',
      fields: [f.text()],
    },
    {
      pageKey: 'studentLife.library.bilingualCollection',
      labelKey: 'admin.editors.studentLife.library.bilingualCollection',
      type: 'single',
      fields: [f.title(), f.description(), f.meta('imageUrl', 'admin.editors.generic.imageUrl')],
    },
    {
      pageKey: 'studentLife.library.studySpace',
      labelKey: 'admin.editors.studentLife.library.studySpace',
      type: 'single',
      fields: [f.title(), f.description(), f.meta('imageUrl', 'admin.editors.generic.imageUrl')],
    },
    {
      pageKey: 'studentLife.library.donate',
      labelKey: 'admin.editors.studentLife.library.donate',
      type: 'single',
      fields: [f.title(), f.description()],
    },
    {
      pageKey: 'studentLife.library.contact',
      labelKey: 'admin.editors.studentLife.library.contact',
      type: 'single',
      fields: [
        f.title(),
        f.description(),
        { key: 'email', labelKey: 'admin.editors.generic.email', type: 'text', maxLength: 150 },
      ],
    },
  ],

  'studentLife/upcoming-events': [
    {
      pageKey: 'studentLife.upcomingEvents.intro',
      labelKey: 'admin.editors.studentLife.upcomingEvents.intro',
      type: 'single',
      defaultOpen: false,
      fields: [f.title(), f.description()],
    },
    {
      pageKey: 'studentLife.upcomingEvents.calendarEvents',
      labelKey: 'admin.editors.studentLife.upcomingEvents.calendarEvents',
      type: 'info',
      fields: [],
      infoIcon: 'i-heroicons-calendar-days',
      infoDescriptionKey: 'admin.editors.studentLife.upcomingEvents.calendarEventsDescription',
      infoLinkTo: '/admin/calendar',
      infoLinkLabelKey: 'admin.editors.studentLife.upcomingEvents.goToCalendar',
    },
    {
      pageKey: 'studentLife.upcomingEvents.stayInformed',
      labelKey: 'admin.editors.studentLife.upcomingEvents.stayInformed',
      type: 'single',
      fields: [f.title(), f.description()],
    },
    {
      pageKey: 'studentLife.upcomingEvents.annualEvents',
      labelKey: 'admin.editors.studentLife.upcomingEvents.annualEvents',
      type: 'list',
      maxItems: 12,
      minItems: 3,
      itemLabelKey: 'admin.editors.generic.event',
      fields: [
        f.title(),
        f.description(),
        {
          key: 'timing',
          labelKey: 'admin.editors.generic.timing',
          type: 'select',
          options: [
            { value: 'january', labelKey: 'admin.editors.generic.months.january' },
            { value: 'february', labelKey: 'admin.editors.generic.months.february' },
            { value: 'march', labelKey: 'admin.editors.generic.months.march' },
            { value: 'april', labelKey: 'admin.editors.generic.months.april' },
            { value: 'may', labelKey: 'admin.editors.generic.months.may' },
            { value: 'june', labelKey: 'admin.editors.generic.months.june' },
            { value: 'july', labelKey: 'admin.editors.generic.months.july' },
            { value: 'august', labelKey: 'admin.editors.generic.months.august' },
            { value: 'september', labelKey: 'admin.editors.generic.months.september' },
            { value: 'october', labelKey: 'admin.editors.generic.months.october' },
            { value: 'november', labelKey: 'admin.editors.generic.months.november' },
            { value: 'december', labelKey: 'admin.editors.generic.months.december' },
          ],
        },
        f.meta('imageUrl', 'admin.editors.generic.imageUrl'),
      ],
    },
  ],

  // ==================== SUPPORT ====================

  'support/why-support': [
    {
      pageKey: 'support.whySupport.intro',
      labelKey: 'admin.editors.support.whySupport.intro',
      type: 'single',
      defaultOpen: false,
      fields: [f.title(), f.paragraph1(), f.paragraph2()],
    },
    {
      pageKey: 'support.whySupport.nonprofit',
      labelKey: 'admin.editors.support.whySupport.nonprofit',
      type: 'single',
      fields: [f.title(), f.description()],
    },
    {
      pageKey: 'support.whySupport.impact',
      labelKey: 'admin.editors.support.whySupport.impact',
      type: 'list',
      maxItems: 6,
      minItems: 2,
      itemLabelKey: 'admin.editors.generic.impactArea',
      fields: [f.title(), f.description(), f.icon()],
    },
  ],

  'support/scholarships': [
    {
      pageKey: 'support.scholarships.intro',
      labelKey: 'admin.editors.support.scholarships.intro',
      type: 'single',
      defaultOpen: false,
      fields: [f.text()],
    },
    {
      pageKey: 'support.scholarships.purpose',
      labelKey: 'admin.editors.support.scholarships.purpose',
      type: 'single',
      fields: [f.title(), f.description()],
    },
    {
      pageKey: 'support.scholarships.impact',
      labelKey: 'admin.editors.support.scholarships.impact',
      type: 'single',
      fields: [f.title(), f.description()],
    },
  ],

  'support/donate': [
    {
      pageKey: 'support.donate.intro',
      labelKey: 'admin.editors.support.donate.intro',
      type: 'single',
      defaultOpen: false,
      fields: [f.text()],
    },
    {
      pageKey: 'support.donate.ways',
      labelKey: 'admin.editors.support.donate.ways',
      type: 'list',
      maxItems: 6,
      minItems: 2,
      itemLabelKey: 'admin.editors.support.donate.method',
      fields: [f.title(), f.description(), f.icon()],
    },
    {
      pageKey: 'support.donate.wishLists',
      labelKey: 'admin.editors.support.donate.wishLists',
      type: 'list',
      maxItems: 5,
      minItems: 1,
      itemLabelKey: 'admin.editors.support.donate.wishList',
      fields: [
        f.title(),
        f.description(),
        { key: 'url', labelKey: 'admin.editors.generic.url', type: 'metadata', maxLength: 200, halfWidth: true },
        f.icon(),
      ],
    },
    {
      pageKey: 'support.donate.donateBooks',
      labelKey: 'admin.editors.support.donate.donateBooks',
      type: 'single',
      fields: [f.title(), f.description()],
    },
    {
      pageKey: 'support.donate.contact',
      labelKey: 'admin.editors.support.donate.contact',
      type: 'single',
      fields: [
        f.title(),
        f.description(),
      ],
    },
    {
      pageKey: 'support.donate.emails',
      labelKey: 'admin.editors.support.donate.emails',
      type: 'list',
      maxItems: 10,
      minItems: 1,
      itemLabelKey: 'admin.editors.generic.email',
      fields: [
        f.meta('email', 'admin.editors.generic.emailAddress', 150),
      ],
    },
  ],

  // support/projects is handled by custom ProjectsEditor

  // ==================== CONTACT ====================

  'contact/info': [
    {
      pageKey: 'contact.info.intro',
      labelKey: 'admin.editors.contact.info.intro',
      type: 'single',
      defaultOpen: false,
      fields: [f.text()],
    },
    {
      pageKey: 'contact.info.phone',
      labelKey: 'admin.editors.contact.info.phone',
      type: 'single',
      fields: [
        f.title(),
        f.description(),
        f.meta('number', 'admin.editors.generic.number', 200, '+504 XXXX-XXXX'),
      ],
    },
    {
      pageKey: 'contact.info.email',
      labelKey: 'admin.editors.contact.info.email',
      type: 'single',
      fields: [
        f.title(),
        f.description(),
        f.meta('address', 'admin.editors.generic.emailAddress'),
      ],
    },
    {
      pageKey: 'contact.info.hours',
      labelKey: 'admin.editors.contact.info.hours',
      type: 'single',
      fields: [
        f.title(),
        f.description(),
        f.meta('schedule', 'admin.editors.generic.schedule'),
        f.meta('time', 'admin.editors.generic.time'),
      ],
    },
    {
      pageKey: 'contact.info.address',
      labelKey: 'admin.editors.contact.info.address',
      type: 'single',
      fields: [
        f.title(),
        f.meta('line1', 'admin.editors.generic.line1'),
        f.meta('line2', 'admin.editors.generic.line2'),
        f.meta('line3', 'admin.editors.generic.line3'),
      ],
    },
  ],

  'contact/directions': [
    {
      pageKey: 'contact.directions.intro',
      labelKey: 'admin.editors.contact.directions.intro',
      type: 'single',
      defaultOpen: false,
      fields: [f.text()],
    },
    {
      pageKey: 'contact.directions.address',
      labelKey: 'admin.editors.contact.directions.address',
      type: 'single',
      fields: [f.title(), { key: 'full', labelKey: 'admin.editors.generic.fullAddress', type: 'textarea', rows: 2, maxLength: 300 }],
    },
    {
      pageKey: 'contact.directions.fromTegucigalpa',
      labelKey: 'admin.editors.contact.directions.fromTegucigalpa',
      type: 'single',
      fields: [f.title(), f.description('admin.editors.generic.directions', 4)],
    },
    {
      pageKey: 'contact.directions.fromSanPedro',
      labelKey: 'admin.editors.contact.directions.fromSanPedro',
      type: 'single',
      fields: [f.title(), f.description('admin.editors.generic.directions', 4)],
    },
    {
      pageKey: 'contact.directions.landmarks',
      labelKey: 'admin.editors.contact.directions.landmarks',
      type: 'list',
      maxItems: 10,
      minItems: 2,
      itemLabelKey: 'admin.editors.generic.landmark',
      fields: [f.text()],
    },
    {
      pageKey: 'contact.directions.parking',
      labelKey: 'admin.editors.contact.directions.parking',
      type: 'single',
      fields: [f.title(), f.description()],
    },
    {
      pageKey: 'contact.directions.mapCoords',
      labelKey: 'admin.editors.contact.directions.mapCoords',
      type: 'single',
      fields: [
        f.meta('lat', 'admin.editors.generic.latitude'),
        f.meta('lng', 'admin.editors.generic.longitude'),
      ],
    },
  ],

  'contact/form': [
    {
      pageKey: 'contact.form.intro',
      labelKey: 'admin.editors.contact.form.intro',
      type: 'single',
      defaultOpen: false,
      fields: [f.text()],
    },
    {
      pageKey: 'contact.form.subjectOptions',
      labelKey: 'admin.editors.contact.form.subjectOptions',
      type: 'list',
      maxItems: 8,
      minItems: 2,
      itemLabelKey: 'admin.editors.generic.option',
      fields: [{ key: 'text', labelKey: 'admin.editors.generic.text', type: 'text', maxLength: 150 }],
    },
    {
      pageKey: 'contact.form.success',
      labelKey: 'admin.editors.contact.form.success',
      type: 'single',
      fields: [f.title(), f.description()],
    },
    {
      pageKey: 'contact.form.error',
      labelKey: 'admin.editors.contact.form.error',
      type: 'single',
      fields: [f.title(), f.description()],
    },
  ],

  // ==================== ADMISSIONS ====================

  'admissions/who-can-apply': [
    {
      pageKey: 'admissions.whoCanApply.intro',
      labelKey: 'admin.editors.admissions.whoCanApply.intro',
      type: 'single',
      defaultOpen: false,
      fields: [f.text()],
    },
    {
      pageKey: 'admissions.whoCanApply.grades',
      labelKey: 'admin.editors.admissions.whoCanApply.grades',
      type: 'list',
      maxItems: 15,
      minItems: 1,
      itemLabelKey: 'admin.editors.academics.grades.level',
      fields: [{ key: 'text', labelKey: 'admin.editors.generic.text', type: 'text', maxLength: 150 }],
    },
    {
      pageKey: 'admissions.whoCanApply.requirements',
      labelKey: 'admin.editors.admissions.whoCanApply.requirements',
      type: 'list',
      maxItems: 10,
      minItems: 2,
      itemLabelKey: 'admin.editors.generic.requirement',
      fields: [{ key: 'text', labelKey: 'admin.editors.generic.text', type: 'text', maxLength: 200 }],
    },
  ],

  'admissions/how-to-apply': [
    {
      pageKey: 'admissions.howToApply.intro',
      labelKey: 'admin.editors.admissions.howToApply.intro',
      type: 'single',
      defaultOpen: false,
      fields: [f.text()],
    },
    {
      pageKey: 'admissions.howToApply.steps',
      labelKey: 'admin.editors.admissions.howToApply.steps',
      type: 'list',
      maxItems: 10,
      minItems: 3,
      itemLabelKey: 'admin.editors.generic.step',
      fields: [f.title(), f.description()],
    },
    {
      pageKey: 'admissions.howToApply.dates',
      labelKey: 'admin.editors.admissions.howToApply.dates',
      type: 'single',
      fields: [f.title(), f.description()],
    },
  ],

  // ==================== GET INVOLVED ====================

  'getInvolved/teachers': [
    {
      pageKey: 'getInvolved.teachers.intro',
      labelKey: 'admin.editors.getInvolved.teachers.intro',
      type: 'single',
      defaultOpen: false,
      fields: [f.text()],
    },
    {
      pageKey: 'getInvolved.teachers.requirements',
      labelKey: 'admin.editors.getInvolved.teachers.requirements',
      type: 'single',
      fields: [f.title(), f.description()],
    },
    {
      pageKey: 'getInvolved.teachers.qualifications',
      labelKey: 'admin.editors.getInvolved.teachers.qualifications',
      type: 'list',
      maxItems: 10,
      minItems: 3,
      itemLabelKey: 'admin.editors.generic.qualification',
      fields: [f.text()],
    },
    {
      pageKey: 'getInvolved.teachers.benefits',
      labelKey: 'admin.editors.getInvolved.teachers.benefits',
      type: 'list',
      maxItems: 10,
      minItems: 3,
      itemLabelKey: 'admin.editors.generic.benefit',
      fields: [f.text()],
    },
    {
      pageKey: 'getInvolved.teachers.applicationForms',
      labelKey: 'admin.editors.getInvolved.teachers.applicationForms',
      type: 'single',
      fields: [
        f.title(),
        f.meta('internationalUrl', 'admin.editors.getInvolved.teachers.internationalFormUrl'),
        f.meta('honduranUrl', 'admin.editors.getInvolved.teachers.honduranFormUrl'),
      ],
    },
    {
      pageKey: 'getInvolved.teachers.contact',
      labelKey: 'admin.editors.getInvolved.teachers.contact',
      type: 'single',
      fields: [
        f.title(),
        f.description(),
        f.meta('email', 'admin.editors.generic.email'),
      ],
    },
  ],

  'getInvolved/volunteer': [
    {
      pageKey: 'getInvolved.volunteer.intro',
      labelKey: 'admin.editors.getInvolved.volunteer.intro',
      type: 'single',
      defaultOpen: false,
      fields: [f.text()],
    },
    {
      pageKey: 'getInvolved.volunteer.shortTerm',
      labelKey: 'admin.editors.getInvolved.volunteer.shortTerm',
      type: 'single',
      fields: [f.title(), f.description()],
    },
    {
      pageKey: 'getInvolved.volunteer.opportunities',
      labelKey: 'admin.editors.getInvolved.volunteer.opportunities',
      type: 'list',
      maxItems: 10,
      minItems: 2,
      itemLabelKey: 'admin.editors.generic.opportunity',
      fields: [f.title(), f.description()],
    },
    {
      pageKey: 'getInvolved.volunteer.howTo',
      labelKey: 'admin.editors.getInvolved.volunteer.howTo',
      type: 'single',
      fields: [f.title(), f.description()],
    },
    {
      pageKey: 'getInvolved.volunteer.contact',
      labelKey: 'admin.editors.getInvolved.volunteer.contact',
      type: 'single',
      fields: [
        f.title(),
        f.description(),
        f.meta('email', 'admin.editors.generic.email'),
      ],
    },
  ],
}

export function getEditorSchema(pageId: string): EditorSection[] | null {
  return schemas[pageId] || null
}
