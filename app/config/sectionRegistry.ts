export interface PageConfig {
  slug: string
  icon: string
  label: string
  description?: string
}

export interface SectionConfig {
  key: string
  icon: string
  label: string
  bgColor: string
  pages: PageConfig[]
}

export const sectionRegistry: SectionConfig[] = [
  {
    key: 'home',
    icon: 'i-heroicons-home',
    label: 'Home',
    bgColor: 'bg-blue-600',
    pages: [
      { slug: 'home', icon: 'i-heroicons-home', label: 'Home Page', description: 'Hero, welcome, values, activities, news' },
    ],
  },
  {
    key: 'about',
    icon: 'i-heroicons-information-circle',
    label: 'About',
    bgColor: 'bg-pink-600',
    pages: [
      { slug: 'mission-vision-values', icon: 'i-heroicons-star', label: 'Mission, Vision & Values', description: 'Core values and mission statement' },
      { slug: 'statement-of-faith', icon: 'i-heroicons-book-open', label: 'Statement of Faith', description: 'Religious beliefs and principles' },
      { slug: 'philosophy', icon: 'i-heroicons-light-bulb', label: 'Philosophy', description: 'Educational philosophy' },
      { slug: 'history', icon: 'i-heroicons-clock', label: 'History', description: 'Timeline and founders' },
      { slug: 'leadership', icon: 'i-heroicons-user-group', label: 'Leadership', description: 'Board and directors' },
      { slug: 'town', icon: 'i-heroicons-map', label: 'Town', description: 'Siguatepeque information' },
    ],
  },
  {
    key: 'academics',
    icon: 'i-heroicons-academic-cap',
    label: 'Academics',
    bgColor: 'bg-yellow-600',
    pages: [
      { slug: 'curriculum', icon: 'i-heroicons-academic-cap', label: 'Curriculum', description: 'Programs and subjects' },
      { slug: 'grades', icon: 'i-heroicons-chart-bar', label: 'Grades', description: 'Grade levels and groupings' },
      { slug: 'calendar', icon: 'i-heroicons-calendar-days', label: 'Calendar', description: 'Academic calendar and dates' },
    ],
  },
  {
    key: 'studentLife',
    icon: 'i-heroicons-face-smile',
    label: 'Student Life',
    bgColor: 'bg-green-600',
    pages: [
      { slug: 'sports-clubs', icon: 'i-heroicons-trophy', label: 'Sports & Clubs', description: 'Athletic programs' },
      { slug: 'service-projects', icon: 'i-heroicons-heart', label: 'Service Projects', description: 'Community service initiatives' },
      { slug: 'library', icon: 'i-heroicons-book-open', label: 'Library', description: 'Rules, hours, reading levels' },
      { slug: 'upcoming-events', icon: 'i-heroicons-calendar', label: 'Upcoming Events', description: 'Annual events' },
      { slug: 'gallery', icon: 'i-heroicons-photo', label: 'Gallery', description: 'Photo gallery management' },
    ],
  },
  {
    key: 'support',
    icon: 'i-heroicons-heart',
    label: 'Support',
    bgColor: 'bg-red-600',
    pages: [
      { slug: 'why-support', icon: 'i-heroicons-heart', label: 'Why Support', description: 'Impact areas' },
      { slug: 'scholarships', icon: 'i-heroicons-academic-cap', label: 'Scholarships', description: 'Scholarship info' },
      { slug: 'donate', icon: 'i-heroicons-currency-dollar', label: 'Donate', description: 'Donation methods and wish lists' },
      { slug: 'projects', icon: 'i-heroicons-wrench-screwdriver', label: 'Projects', description: 'Current projects' },
    ],
  },
  {
    key: 'contact',
    icon: 'i-heroicons-phone',
    label: 'Contact',
    bgColor: 'bg-orange-600',
    pages: [
      { slug: 'info', icon: 'i-heroicons-phone', label: 'Contact Info', description: 'Phone, email, hours' },
      { slug: 'directions', icon: 'i-heroicons-map-pin', label: 'Directions', description: 'Maps and directions' },
      { slug: 'form', icon: 'i-heroicons-envelope', label: 'Contact Form', description: 'Form settings' },
      { slug: 'faq', icon: 'i-heroicons-question-mark-circle', label: 'FAQ', description: 'Questions and answers' },
    ],
  },
  {
    key: 'admissions',
    icon: 'i-heroicons-clipboard-document-check',
    label: 'Admissions',
    bgColor: 'bg-emerald-600',
    pages: [
      { slug: 'who-can-apply', icon: 'i-heroicons-user-plus', label: 'Who Can Apply', description: 'Eligibility and requirements' },
      { slug: 'how-to-apply', icon: 'i-heroicons-clipboard-document-list', label: 'How to Apply', description: 'Application steps' },
      { slug: 'calendar', icon: 'i-heroicons-calendar-days', label: 'Calendar', description: 'Admissions dates' },
    ],
  },
  {
    key: 'getInvolved',
    icon: 'i-heroicons-hand-raised',
    label: 'Get Involved',
    bgColor: 'bg-purple-600',
    pages: [
      { slug: 'teachers', icon: 'i-heroicons-user-group', label: 'Teachers', description: 'Requirements and benefits' },
      { slug: 'volunteer', icon: 'i-heroicons-hand-raised', label: 'Volunteer', description: 'Volunteer opportunities' },
    ],
  },
]

export function getSectionKeys(): string[] {
  return sectionRegistry.map((s) => s.key)
}

export function getSectionConfig(key: string): SectionConfig | undefined {
  return sectionRegistry.find((s) => s.key === key)
}
