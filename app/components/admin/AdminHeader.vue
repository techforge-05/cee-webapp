<template>
  <header class="sticky top-0 z-30 bg-white border-b border-gray-200 h-16">
    <div class="flex items-center justify-between h-full px-4 lg:px-6">
      <!-- === MOBILE LEFT === -->
      <div class="flex items-center gap-2 lg:hidden">
        <UButton
          icon="i-heroicons-bars-3"
          variant="outline"
          color="neutral"
          size="md"
          @click="adminStore.toggleSidebar()"
        />
        <span class="text-sm font-bold">
          <span class="text-teal-600 text-lg">CEE</span> admin
        </span>
      </div>

      <!-- === DESKTOP LEFT === -->
      <div class="hidden lg:flex items-center gap-3">
        <nav class="flex items-center gap-1.5 text-sm">
          <NuxtLink
            :to="localePath('/admin')"
            class="text-gray-500 hover:text-gray-700"
          >
            Admin
          </NuxtLink>
          <template v-for="(crumb, index) in breadcrumbs" :key="index">
            <UIcon
              name="i-heroicons-chevron-right"
              class="w-4 h-4 text-gray-400"
            />
            <NuxtLink
              v-if="crumb.to"
              :to="crumb.to"
              class="text-gray-500 hover:text-gray-700"
            >
              {{ crumb.label }}
            </NuxtLink>
            <span v-else class="text-gray-900 font-medium">
              {{ crumb.label }}
            </span>
          </template>
        </nav>
      </div>

      <!-- === MOBILE RIGHT === -->
      <div class="flex items-center gap-1 lg:hidden">
        <UButton
          icon="i-heroicons-arrow-left"
          variant="ghost"
          color="neutral"
          size="sm"
          @click="router.back()"
        />
        <UDropdownMenu :items="mobileAccountItems" :modal="false">
          <UButton
            icon="i-heroicons-ellipsis-vertical"
            variant="ghost"
            color="neutral"
            size="md"
          />
          <template #active-language-trailing>
            <UIcon
              name="i-heroicons-check-circle"
              class="w-5 h-5 text-teal-600"
            />
          </template>
        </UDropdownMenu>
      </div>

      <!-- === DESKTOP RIGHT === -->
      <div class="hidden lg:flex items-center gap-3">
        <LanguageSwitcher />

        <div class="flex items-center gap-2 text-sm text-gray-600">
          <UIcon name="i-heroicons-user-circle" class="w-5 h-5" />
          <span class="truncate max-w-40">{{ adminStore.profile?.email }}</span>
        </div>

        <UButton variant="ghost" color="error" size="xs" @click="handleSignOut">
          <UIcon
            name="i-heroicons-arrow-right-start-on-rectangle"
            class="w-4 h-4"
          />
          <span class="ml-1">{{ $t('nav.signOut') || 'Sign Out' }}</span>
        </UButton>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  const adminStore = useAdminStore();
  const supabase = useSupabaseClient();
  const localePath = useLocalePath();
  const route = useRoute();
  const router = useRouter();
  const { t, locale, locales } = useI18n();
  const switchLocalePath = useSwitchLocalePath();

  import { getSectionConfig } from '~/config/sectionRegistry';

  const mobileAccountItems = computed(() => {
    const accountGroup = [
      {
        label: adminStore.profile?.email || '',
        icon: 'i-heroicons-user',
        disabled: true,
      },
      // {
      //   label: 'Invite users',
      //   icon: 'i-lucide-user-plus',
      //   children: [
      //     {
      //       label: 'Invite by email',
      //       icon: 'i-lucide-send-horizontal',
      //       kbds: ['meta', 'e'],
      //       onSelect() {
      //         console.log('Invite by email clicked');
      //       },
      //     },
      //     {
      //       label: 'Invite by link',
      //       icon: 'i-lucide-link',
      //       kbds: ['meta', 'i'],
      //       onSelect() {
      //         console.log('Invite by link clicked');
      //       },
      //     },
      //   ],
      // },
    ];

    const languageGroup = [
      {
        label: 'Language',
        icon: 'i-heroicons-language',
        children: locales.value.map((l) => ({
          label: l.name,
          // icon: locale.value === l.code ? 'i-heroicons-check-circle' : 'i-heroicons-language',
          onClick: async () => {
            const path = switchLocalePath(l.code);
            await router.push(path);
          },
          slot: locale.value === l.code ? 'active-language' : undefined,
        })),
      },
    ];

    const signOutGroup = [
      {
        label: t('nav.signOut') || 'Sign Out',
        icon: 'i-heroicons-arrow-right-start-on-rectangle',
        onClick: handleSignOut,
      },
    ];

    return [accountGroup, languageGroup, signOutGroup];
  });

  const breadcrumbs = computed(() => {
    const path = route.path;
    const crumbs: Array<{ label: string; to?: string }> = [];

    if (path.includes('/admin/users')) {
      crumbs.push({ label: 'Users', to: localePath('/admin/users') });
      if (route.params.id) {
        crumbs.push({ label: 'User Details' });
      }
    } else if (path.includes('/admin/manage-nav')) {
      crumbs.push({ label: t('admin.manageNav.title', 'Manage Nav') });
    } else if (path.includes('/admin/calendar')) {
      crumbs.push({
        label: t('nav.academics', 'Academics'),
        to: localePath('/admin/sections/academics'),
      });
      crumbs.push({ label: 'Calendar' });
    } else if (path.includes('/admin/announcements')) {
      crumbs.push({ label: 'Announcements' });
    } else if (path.includes('/admin/sections/')) {
      const section = route.params.section as string;
      const page = route.params.page as string;
      const fallbackLabel = getSectionConfig(section)?.label || section;
      const sectionLabel = t(`nav.${section}`, fallbackLabel);

      crumbs.push({
        label: sectionLabel,
        to: page ? localePath(`/admin/sections/${section}`) : undefined,
      });

      if (page) {
        crumbs.push({ label: formatPageName(page) });
      }
    }

    return crumbs;
  });

  const formatPageName = (page: string) => {
    return page
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleSignOut = async () => {
    adminStore.clearProfile();
    await supabase.auth.signOut();
    await navigateTo(localePath('/'));
  };
</script>
