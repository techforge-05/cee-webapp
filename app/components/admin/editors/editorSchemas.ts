export interface EditorField {
  key: string
  labelKey: string
  type: 'text' | 'textarea' | 'metadata'
  maxLength?: number
  rows?: number
}

export interface EditorSection {
  pageKey: string
  labelKey: string
  type: 'single' | 'list'
  defaultOpen?: boolean
  fields: EditorField[]
  maxItems?: number
  minItems?: number
  itemLabelKey?: string
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
  meta: (key: string, labelKey: string, maxLength = 200): EditorField => ({
    key,
    labelKey,
    type: 'metadata',
    maxLength,
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
      defaultOpen: true,
      fields: [f.title(), f.paragraph1(), f.paragraph2()],
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
      fields: [f.title(), f.description()],
    },
  ],

  'about/statement-of-faith': [
    {
      pageKey: 'about.sof.intro',
      labelKey: 'admin.editors.about.sof.intro',
      type: 'single',
      defaultOpen: true,
      fields: [f.text()],
    },
    {
      pageKey: 'about.sof.beliefs',
      labelKey: 'admin.editors.about.sof.beliefs',
      type: 'list',
      maxItems: 15,
      minItems: 5,
      itemLabelKey: 'admin.editors.about.sof.belief',
      fields: [f.title(), f.content()],
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
      defaultOpen: true,
      fields: [f.text()],
    },
    {
      pageKey: 'about.philosophy.biblical',
      labelKey: 'admin.editors.about.philosophy.biblical',
      type: 'single',
      fields: [f.title(), f.content()],
    },
    {
      pageKey: 'about.philosophy.dignity',
      labelKey: 'admin.editors.about.philosophy.dignity',
      type: 'single',
      fields: [f.title(), f.content()],
    },
    {
      pageKey: 'about.philosophy.bilingual',
      labelKey: 'admin.editors.about.philosophy.bilingual',
      type: 'single',
      fields: [f.title(), f.content()],
    },
    {
      pageKey: 'about.philosophy.principles',
      labelKey: 'admin.editors.about.philosophy.principles',
      type: 'list',
      maxItems: 5,
      minItems: 2,
      itemLabelKey: 'admin.editors.generic.principle',
      fields: [f.title(), f.description()],
    },
  ],

  'about/history': [
    {
      pageKey: 'about.history.intro',
      labelKey: 'admin.editors.about.history.intro',
      type: 'single',
      defaultOpen: true,
      fields: [f.text()],
    },
    {
      pageKey: 'about.history.timeline',
      labelKey: 'admin.editors.about.history.timeline',
      type: 'list',
      maxItems: 12,
      minItems: 4,
      itemLabelKey: 'admin.editors.about.history.period',
      fields: [f.title(), f.content()],
    },
    {
      pageKey: 'about.history.legacy',
      labelKey: 'admin.editors.about.history.legacy',
      type: 'single',
      fields: [f.title(), f.content()],
    },
  ],

  'about/town': [
    {
      pageKey: 'about.town.intro',
      labelKey: 'admin.editors.about.town.intro',
      type: 'single',
      defaultOpen: true,
      fields: [f.title(), f.paragraph1(), f.paragraph2()],
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
      pageKey: 'about.town.activities',
      labelKey: 'admin.editors.about.town.activities',
      type: 'list',
      maxItems: 8,
      minItems: 3,
      itemLabelKey: 'admin.editors.generic.activity',
      fields: [f.title(), f.description()],
    },
  ],

  // ==================== ACADEMICS ====================

  'academics/curriculum': [
    {
      pageKey: 'academics.curriculum.intro',
      labelKey: 'admin.editors.academics.curriculum.intro',
      type: 'single',
      defaultOpen: true,
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
      fields: [f.text()],
    },
    {
      pageKey: 'academics.curriculum.secondary',
      labelKey: 'admin.editors.academics.curriculum.secondary',
      type: 'single',
      fields: [f.name(), f.description()],
    },
    {
      pageKey: 'academics.curriculum.secondarySubjects78',
      labelKey: 'admin.editors.academics.curriculum.subjects78',
      type: 'list',
      maxItems: 15,
      minItems: 2,
      itemLabelKey: 'admin.editors.generic.subject',
      fields: [f.text()],
    },
    {
      pageKey: 'academics.curriculum.secondarySubjects9',
      labelKey: 'admin.editors.academics.curriculum.subjects9',
      type: 'list',
      maxItems: 15,
      minItems: 2,
      itemLabelKey: 'admin.editors.generic.subject',
      fields: [f.text()],
    },
    {
      pageKey: 'academics.curriculum.secondarySubjects1011',
      labelKey: 'admin.editors.academics.curriculum.subjects1011',
      type: 'list',
      maxItems: 15,
      minItems: 2,
      itemLabelKey: 'admin.editors.generic.subject',
      fields: [f.text()],
    },
    {
      pageKey: 'academics.curriculum.benefits',
      labelKey: 'admin.editors.academics.curriculum.benefits',
      type: 'list',
      maxItems: 5,
      minItems: 2,
      itemLabelKey: 'admin.editors.generic.benefit',
      fields: [f.title(), f.description()],
    },
  ],

  'academics/grades': [
    {
      pageKey: 'academics.grades.intro',
      labelKey: 'admin.editors.academics.grades.intro',
      type: 'single',
      defaultOpen: true,
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
      ],
    },
    {
      pageKey: 'academics.grades.specialPrograms',
      labelKey: 'admin.editors.academics.grades.specialPrograms',
      type: 'list',
      maxItems: 8,
      minItems: 3,
      itemLabelKey: 'admin.editors.generic.program',
      fields: [f.title(), f.description()],
    },
    {
      pageKey: 'academics.grades.approach',
      labelKey: 'admin.editors.academics.grades.approach',
      type: 'list',
      maxItems: 5,
      minItems: 2,
      itemLabelKey: 'admin.editors.generic.approach',
      fields: [f.title(), f.description()],
    },
  ],

  // ==================== STUDENT LIFE ====================

  'studentLife/sports-clubs': [
    {
      pageKey: 'studentLife.sports.intro',
      labelKey: 'admin.editors.studentLife.sports.intro',
      type: 'single',
      defaultOpen: true,
      fields: [f.title(), f.description()],
    },
    {
      pageKey: 'studentLife.sports.items',
      labelKey: 'admin.editors.studentLife.sports.items',
      type: 'list',
      maxItems: 8,
      minItems: 2,
      itemLabelKey: 'admin.editors.studentLife.sports.sport',
      fields: [f.title(), f.description()],
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
      defaultOpen: true,
      fields: [f.text()],
    },
    {
      pageKey: 'studentLife.serviceProjects.benefits',
      labelKey: 'admin.editors.studentLife.serviceProjects.benefits',
      type: 'list',
      maxItems: 6,
      minItems: 2,
      itemLabelKey: 'admin.editors.generic.benefit',
      fields: [f.title(), f.description()],
    },
    {
      pageKey: 'studentLife.serviceProjects.items',
      labelKey: 'admin.editors.studentLife.serviceProjects.projects',
      type: 'list',
      maxItems: 8,
      minItems: 2,
      itemLabelKey: 'admin.editors.generic.project',
      fields: [f.title(), f.description()],
    },
  ],

  'studentLife/library': [
    {
      pageKey: 'studentLife.library.intro',
      labelKey: 'admin.editors.studentLife.library.intro',
      type: 'single',
      defaultOpen: true,
      fields: [f.text()],
    },
    {
      pageKey: 'studentLife.library.purpose',
      labelKey: 'admin.editors.studentLife.library.purpose',
      type: 'single',
      fields: [f.title(), f.description()],
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
      fields: [f.title(), f.description()],
    },
    {
      pageKey: 'studentLife.library.hours',
      labelKey: 'admin.editors.studentLife.library.hours',
      type: 'list',
      maxItems: 7,
      minItems: 1,
      itemLabelKey: 'admin.editors.generic.schedule',
      fields: [
        f.meta('day', 'admin.editors.generic.day'),
        f.meta('hours', 'admin.editors.generic.hours'),
      ],
    },
    {
      pageKey: 'studentLife.library.gradeSupport',
      labelKey: 'admin.editors.studentLife.library.gradeSupport',
      type: 'list',
      maxItems: 5,
      minItems: 2,
      itemLabelKey: 'admin.editors.academics.grades.level',
      fields: [f.title(), f.description()],
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
      fields: [f.title(), f.description()],
    },
    {
      pageKey: 'studentLife.library.studySpace',
      labelKey: 'admin.editors.studentLife.library.studySpace',
      type: 'single',
      fields: [f.title(), f.description()],
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
        f.meta('email', 'admin.editors.generic.email'),
      ],
    },
  ],

  'studentLife/upcoming-events': [
    {
      pageKey: 'studentLife.upcomingEvents.intro',
      labelKey: 'admin.editors.studentLife.upcomingEvents.intro',
      type: 'single',
      defaultOpen: true,
      fields: [f.title(), f.description()],
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
        f.meta('timing', 'admin.editors.generic.timing'),
      ],
    },
  ],

  // ==================== SUPPORT ====================

  'support/why-support': [
    {
      pageKey: 'support.whySupport.intro',
      labelKey: 'admin.editors.support.whySupport.intro',
      type: 'single',
      defaultOpen: true,
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
      fields: [f.title(), f.description()],
    },
  ],

  'support/scholarships': [
    {
      pageKey: 'support.scholarships.intro',
      labelKey: 'admin.editors.support.scholarships.intro',
      type: 'single',
      defaultOpen: true,
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
      defaultOpen: true,
      fields: [f.text()],
    },
    {
      pageKey: 'support.donate.ways',
      labelKey: 'admin.editors.support.donate.ways',
      type: 'list',
      maxItems: 6,
      minItems: 2,
      itemLabelKey: 'admin.editors.support.donate.method',
      fields: [f.title(), f.description()],
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
        f.meta('url', 'admin.editors.generic.url'),
      ],
    },
    {
      pageKey: 'support.donate.spanishBooks',
      labelKey: 'admin.editors.support.donate.spanishBooks',
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
        f.meta('email', 'admin.editors.generic.email'),
        f.meta('phone', 'admin.editors.generic.phone'),
      ],
    },
  ],

  'support/projects': [
    {
      pageKey: 'support.projects.intro',
      labelKey: 'admin.editors.support.projects.intro',
      type: 'single',
      defaultOpen: true,
      fields: [f.text()],
    },
    {
      pageKey: 'support.projects.items',
      labelKey: 'admin.editors.support.projects.items',
      type: 'list',
      maxItems: 8,
      minItems: 1,
      itemLabelKey: 'admin.editors.generic.project',
      fields: [
        f.title(),
        f.description(),
        f.meta('slug', 'admin.editors.generic.slug'),
        f.meta('status', 'admin.editors.generic.status'),
        f.meta('goal', 'admin.editors.generic.goal'),
      ],
    },
    {
      pageKey: 'support.projects.howToHelp',
      labelKey: 'admin.editors.support.projects.howToHelp',
      type: 'list',
      maxItems: 8,
      minItems: 2,
      itemLabelKey: 'admin.editors.generic.item',
      fields: [f.text()],
    },
  ],

  // ==================== CONTACT ====================

  'contact/info': [
    {
      pageKey: 'contact.info.intro',
      labelKey: 'admin.editors.contact.info.intro',
      type: 'single',
      defaultOpen: true,
      fields: [f.text()],
    },
    {
      pageKey: 'contact.info.phone',
      labelKey: 'admin.editors.contact.info.phone',
      type: 'single',
      fields: [
        f.title(),
        f.description(),
        f.meta('number', 'admin.editors.generic.number'),
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
      defaultOpen: true,
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
      defaultOpen: true,
      fields: [f.text()],
    },
    {
      pageKey: 'contact.form.subjectOptions',
      labelKey: 'admin.editors.contact.form.subjectOptions',
      type: 'list',
      maxItems: 8,
      minItems: 2,
      itemLabelKey: 'admin.editors.generic.option',
      fields: [f.text()],
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
      defaultOpen: true,
      fields: [f.text()],
    },
    {
      pageKey: 'admissions.whoCanApply.grades',
      labelKey: 'admin.editors.admissions.whoCanApply.grades',
      type: 'list',
      maxItems: 15,
      minItems: 1,
      itemLabelKey: 'admin.editors.academics.grades.level',
      fields: [f.text()],
    },
    {
      pageKey: 'admissions.whoCanApply.requirements',
      labelKey: 'admin.editors.admissions.whoCanApply.requirements',
      type: 'list',
      maxItems: 10,
      minItems: 2,
      itemLabelKey: 'admin.editors.generic.requirement',
      fields: [f.text()],
    },
  ],

  'admissions/how-to-apply': [
    {
      pageKey: 'admissions.howToApply.intro',
      labelKey: 'admin.editors.admissions.howToApply.intro',
      type: 'single',
      defaultOpen: true,
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
      defaultOpen: true,
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
      defaultOpen: true,
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
