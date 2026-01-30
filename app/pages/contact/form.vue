<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('contact.form.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-teal-100">
          {{ $t('contact.form.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Introduction Section -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <UIcon
            name="i-heroicons-pencil-square"
            class="w-16 h-16 text-red-600 mx-auto mb-6"
          />
          <p class="text-xl text-gray-700 leading-relaxed">
            {{ $t('contact.form.intro') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Form Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-2xl mx-auto">
          <!-- Success Message -->
          <div
            v-if="formStatus === 'success'"
            class="bg-green-50 border border-green-200 rounded-xl p-6 mb-8"
          >
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-check-circle" class="w-8 h-8 text-green-600" />
              <div>
                <h3 class="text-lg font-bold text-green-800">
                  {{ $t('contact.form.success.title') }}
                </h3>
                <p class="text-green-700">
                  {{ $t('contact.form.success.description') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div
            v-if="formStatus === 'error'"
            class="bg-red-50 border border-red-200 rounded-xl p-6 mb-8"
          >
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-exclamation-circle" class="w-8 h-8 text-red-600" />
              <div>
                <h3 class="text-lg font-bold text-red-800">
                  {{ $t('contact.form.error.title') }}
                </h3>
                <p class="text-red-700">
                  {{ $t('contact.form.error.description') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <form
            v-if="formStatus !== 'success'"
            @submit.prevent="handleSubmit"
            class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
          >
            <!-- Name Field -->
            <div class="mb-6">
              <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
                {{ $t('contact.form.fields.name.label') }} *
              </label>
              <UInput
                id="name"
                v-model="formData.name"
                type="text"
                :placeholder="$t('contact.form.fields.name.placeholder')"
                size="lg"
                :color="errors.name ? 'error' : 'primary'"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">
                {{ errors.name }}
              </p>
            </div>

            <!-- Email Field -->
            <div class="mb-6">
              <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                {{ $t('contact.form.fields.email.label') }} *
              </label>
              <UInput
                id="email"
                v-model="formData.email"
                type="email"
                :placeholder="$t('contact.form.fields.email.placeholder')"
                size="lg"
                :color="errors.email ? 'error' : 'primary'"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">
                {{ errors.email }}
              </p>
            </div>

            <!-- Phone Field (Optional) -->
            <div class="mb-6">
              <label for="phone" class="block text-sm font-semibold text-gray-700 mb-2">
                {{ $t('contact.form.fields.phone.label') }}
              </label>
              <UInput
                id="phone"
                v-model="formData.phone"
                type="tel"
                :placeholder="$t('contact.form.fields.phone.placeholder')"
                size="lg"
              />
            </div>

            <!-- Subject Field -->
            <div class="mb-6">
              <label for="subject" class="block text-sm font-semibold text-gray-700 mb-2">
                {{ $t('contact.form.fields.subject.label') }} *
              </label>
              <USelect
                id="subject"
                v-model="formData.subject"
                :options="subjectOptions"
                :placeholder="$t('contact.form.fields.subject.placeholder')"
                size="lg"
                :color="errors.subject ? 'error' : 'primary'"
              />
              <p v-if="errors.subject" class="mt-1 text-sm text-red-600">
                {{ errors.subject }}
              </p>
            </div>

            <!-- Message Field -->
            <div class="mb-8">
              <label for="message" class="block text-sm font-semibold text-gray-700 mb-2">
                {{ $t('contact.form.fields.message.label') }} *
              </label>
              <UTextarea
                id="message"
                v-model="formData.message"
                :placeholder="$t('contact.form.fields.message.placeholder')"
                :rows="6"
                size="lg"
                :color="errors.message ? 'error' : 'primary'"
              />
              <p v-if="errors.message" class="mt-1 text-sm text-red-600">
                {{ errors.message }}
              </p>
            </div>

            <!-- Submit Button -->
            <UButton
              type="submit"
              size="lg"
              color="primary"
              class="w-full bg-red-600 hover:bg-red-700"
              :loading="isSubmitting"
              :disabled="isSubmitting"
            >
              <UIcon v-if="!isSubmitting" name="i-heroicons-paper-airplane" class="w-5 h-5 mr-2" />
              {{ isSubmitting ? $t('contact.form.sending') : $t('contact.form.submit') }}
            </UButton>
          </form>

          <!-- Reset Button (after success) -->
          <div v-if="formStatus === 'success'" class="text-center">
            <UButton
              @click="resetForm"
              size="lg"
              variant="outline"
              class="border-2 border-red-600 text-red-600 hover:bg-red-50"
            >
              {{ $t('contact.form.title') }}
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Alternative Contact Section -->
    <section class="py-16 bg-orange-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            {{ $t('contact.form.cta.title') }}
          </h2>
          <p class="text-xl text-gray-700 mb-8">
            {{ $t('contact.form.cta.description') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              :to="localePath('/contact/info')"
              size="lg"
              color="primary"
              class="bg-red-600 hover:bg-red-700"
            >
              <UIcon name="i-heroicons-information-circle" class="w-5 h-5 mr-2" />
              {{ $t('contact.form.cta.viewInfo') }}
            </UButton>
            <UButton
              href="https://wa.me/50493268998"
              target="_blank"
              size="lg"
              variant="outline"
              class="border-2 border-red-600 text-red-600 hover:bg-red-50"
            >
              <UIcon name="i-heroicons-phone" class="w-5 h-5 mr-2" />
              {{ $t('contact.form.cta.callUs') }}
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section
      class="py-16 bg-gradient-to-r from-teal-600 to-cyan-600 text-white"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          {{ $t('contact.faq.stillHaveQuestions.title') }}
        </h2>
        <p class="text-xl mb-8 max-w-3xl mx-auto">
          {{ $t('contact.faq.stillHaveQuestions.description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            :to="localePath('/contact/faq')"
            size="lg"
            variant="solid"
            class="bg-white text-teal-700 hover:bg-gray-100"
          >
            {{ $t('nav.dropdowns.contact.faq') }}
          </UButton>
          <UButton
            :to="localePath('/contact/directions')"
            size="lg"
            variant="outline"
            class="border-2 border-white text-white hover:bg-white hover:text-teal-600"
          >
            {{ $t('nav.dropdowns.contact.directions') }}
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { t, tm, rt } = useI18n();

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
});

const errors = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const isSubmitting = ref(false);
const formStatus = ref<'idle' | 'success' | 'error'>('idle');

const subjectOptions = computed(() => {
  const options = tm('contact.form.fields.subject.options') as any[];
  return options.map((option) => ({
    label: rt(option),
    value: rt(option),
  }));
});

const validateForm = () => {
  let isValid = true;

  // Reset errors
  errors.name = '';
  errors.email = '';
  errors.subject = '';
  errors.message = '';

  // Name validation
  if (!formData.name.trim()) {
    errors.name = t('contact.form.validation.nameRequired');
    isValid = false;
  }

  // Email validation
  if (!formData.email.trim()) {
    errors.email = t('contact.form.validation.emailRequired');
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = t('contact.form.validation.emailInvalid');
    isValid = false;
  }

  // Subject validation
  if (!formData.subject) {
    errors.subject = t('contact.form.validation.subjectRequired');
    isValid = false;
  }

  // Message validation
  if (!formData.message.trim()) {
    errors.message = t('contact.form.validation.messageRequired');
    isValid = false;
  } else if (formData.message.trim().length < 10) {
    errors.message = t('contact.form.validation.messageTooShort');
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;
  formStatus.value = 'idle';

  try {
    // Simulate form submission (replace with actual API call)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real implementation, you would send the data to your backend
    // const response = await $fetch('/api/contact', {
    //   method: 'POST',
    //   body: formData,
    // });

    formStatus.value = 'success';
  } catch (error) {
    formStatus.value = 'error';
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  formData.name = '';
  formData.email = '';
  formData.phone = '';
  formData.subject = '';
  formData.message = '';
  formStatus.value = 'idle';
};

useHead({
  title: 'Contact Form - CEE',
  meta: [
    {
      name: 'description',
      content:
        'Send us a message. Contact CEE with questions about admissions, scholarships, donations, or general inquiries.',
    },
  ],
});
</script>
