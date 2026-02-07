<template>
  <div class="min-h-screen bg-gray-50">
    <AdminSidebar />
    <div class="lg:ml-64 flex flex-col min-h-screen">
      <AdminHeader />
      <main class="flex-1 p-4 lg:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// Middleware is applied on each admin page via definePageMeta
</script>
