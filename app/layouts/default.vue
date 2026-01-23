<template>
  <div class="min-h-screen bg-white w-full flex flex-col">
    <Navbar />
    <main class="pt-16 w-full flex-1">
      <slot />
    </main>
    <Footer />
  </div>
</template>
