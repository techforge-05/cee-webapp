export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'es',
  messages: {
    es: {
      app: {
        name: 'CEE WebApp',
        welcome: 'Bienvenido a CEE WebApp',
      },
      nav: {
        signIn: 'Iniciar Sesión',
        signUp: 'Registrarse',
        signOut: 'Cerrar Sesión',
      },
      auth: {
        login: {
          title: 'Inicia sesión en tu cuenta',
          email: 'Correo electrónico',
          password: 'Contraseña',
          confirmPassword: 'Confirmar Contraseña',
          emailPlaceholder: 'tu@ejemplo.com',
          passwordPlaceholder: '••••••••',
          signInButton: 'Iniciar sesión con Email',
          signUpButton: 'Registrarse con Email',
          googleButton: 'Iniciar sesión con Google',
          googleSignUpButton: 'Registrarse con Google',
          orContinueWith: 'O continuar con',
          noAccount: '¿No tienes una cuenta?',
          hasAccount: '¿Ya tienes una cuenta?',
          signUpLink: 'Registrarse',
          signInLink: 'Iniciar sesión',
        },
        signup: {
          title: 'Crea tu cuenta',
          successMessage: '¡Cuenta creada exitosamente! Por favor revisa tu correo para verificar tu cuenta.',
        },
        callback: {
          completing: 'Completando inicio de sesión...',
        },
        errors: {
          passwordMismatch: 'Las contraseñas no coinciden',
          passwordTooShort: 'La contraseña debe tener al menos 6 caracteres',
          signInError: 'Ocurrió un error durante el inicio de sesión',
          signUpError: 'Ocurrió un error durante el registro',
          googleSignInError: 'Ocurrió un error durante el inicio de sesión con Google',
          googleSignUpError: 'Ocurrió un error durante el registro con Google',
        },
      },
      home: {
        hero: {
          videoAlt: 'Video de presentación del centro educativo',
        },
        welcome: {
          title: 'Bienvenidos a Nuestro Centro Educativo',
          subtitle: 'Educación de calidad para el futuro de nuestros estudiantes',
          description: 'En nuestro centro educativo nos dedicamos a formar estudiantes integrales, preparados para los desafíos del futuro. Con más de 20 años de experiencia, ofrecemos un ambiente seguro y estimulante para el aprendizaje.',
        },
        values: {
          title: 'Valores y Principios',
          subtitle: 'Los pilares que guían nuestra comunidad educativa',
          items: [
            {
              title: 'Excelencia Académica',
              description: 'Promovemos el logro académico y el desarrollo intelectual de cada estudiante.',
            },
            {
              title: 'Respeto y Tolerancia',
              description: 'Fomentamos un ambiente inclusivo donde todos son valorados y respetados.',
            },
            {
              title: 'Responsabilidad',
              description: 'Enseñamos la importancia del compromiso y la responsabilidad personal.',
            },
            {
              title: 'Innovación',
              description: 'Incorporamos metodologías modernas para el aprendizaje del siglo XXI.',
            },
          ],
        },
        enrollment: {
          title: 'Inscripciones Abiertas',
          subtitle: 'Únete a nuestra comunidad educativa',
          description: 'Estamos aceptando nuevos estudiantes para el próximo año escolar. Contamos con programas desde preescolar hasta secundaria.',
          cta: 'Más Información',
          features: [
            'Educación bilingüe',
            'Instalaciones modernas',
            'Actividades extracurriculares',
            'Atención personalizada',
          ],
        },
        activities: {
          title: 'Actividades Escolares',
          subtitle: 'Desarrollo integral más allá del aula',
          items: [
            {
              title: 'Deportes',
              description: 'Fútbol, baloncesto, voleibol y más',
            },
            {
              title: 'Arte y Cultura',
              description: 'Música, teatro y artes plásticas',
            },
            {
              title: 'Ciencia y Tecnología',
              description: 'Robótica, programación y experimentos',
            },
            {
              title: 'Talleres',
              description: 'Manualidades, cocina y emprendimiento',
            },
          ],
        },
        news: {
          title: 'Noticias y Anuncios',
          subtitle: 'Mantente informado sobre lo que sucede en nuestra escuela',
          viewAll: 'Ver todas las noticias',
          items: [
            {
              title: 'Inicio del Nuevo Año Escolar',
              date: '15 de Enero, 2025',
              excerpt: 'Damos la bienvenida a todos nuestros estudiantes para este nuevo ciclo escolar lleno de oportunidades...',
            },
            {
              title: 'Feria de Ciencias 2025',
              date: '10 de Enero, 2025',
              excerpt: 'Nuestros estudiantes presentarán sus proyectos científicos más innovadores...',
            },
            {
              title: 'Nuevo Programa de Becas',
              date: '5 de Enero, 2025',
              excerpt: 'Anunciamos la apertura de nuestro programa de becas para estudiantes destacados...',
            },
          ],
        },
      },
    },
    en: {
      app: {
        name: 'CEE WebApp',
        welcome: 'Welcome to CEE WebApp',
      },
      nav: {
        signIn: 'Sign In',
        signUp: 'Sign Up',
        signOut: 'Sign Out',
      },
      auth: {
        login: {
          title: 'Sign in to your account',
          email: 'Email',
          password: 'Password',
          confirmPassword: 'Confirm Password',
          emailPlaceholder: 'you@example.com',
          passwordPlaceholder: '••••••••',
          signInButton: 'Sign in with Email',
          signUpButton: 'Sign up with Email',
          googleButton: 'Sign in with Google',
          googleSignUpButton: 'Sign up with Google',
          orContinueWith: 'Or continue with',
          noAccount: "Don't have an account?",
          hasAccount: 'Already have an account?',
          signUpLink: 'Sign up',
          signInLink: 'Sign in',
        },
        signup: {
          title: 'Create your account',
          successMessage: 'Account created successfully! Please check your email to verify your account.',
        },
        callback: {
          completing: 'Completing sign in...',
        },
        errors: {
          passwordMismatch: 'Passwords do not match',
          passwordTooShort: 'Password must be at least 6 characters',
          signInError: 'An error occurred during sign in',
          signUpError: 'An error occurred during sign up',
          googleSignInError: 'An error occurred during Google sign in',
          googleSignUpError: 'An error occurred during Google sign up',
        },
      },
      home: {
        hero: {
          videoAlt: 'Educational center presentation video',
        },
        welcome: {
          title: 'Welcome to Our Educational Center',
          subtitle: 'Quality education for our students\' future',
          description: 'At our educational center we are dedicated to forming well-rounded students, prepared for future challenges. With over 20 years of experience, we offer a safe and stimulating environment for learning.',
        },
        values: {
          title: 'Values and Principles',
          subtitle: 'The pillars that guide our educational community',
          items: [
            {
              title: 'Academic Excellence',
              description: 'We promote academic achievement and intellectual development of each student.',
            },
            {
              title: 'Respect and Tolerance',
              description: 'We foster an inclusive environment where everyone is valued and respected.',
            },
            {
              title: 'Responsibility',
              description: 'We teach the importance of commitment and personal responsibility.',
            },
            {
              title: 'Innovation',
              description: 'We incorporate modern methodologies for 21st century learning.',
            },
          ],
        },
        enrollment: {
          title: 'Enrollment Open',
          subtitle: 'Join our educational community',
          description: 'We are accepting new students for the upcoming school year. We have programs from preschool through high school.',
          cta: 'More Information',
          features: [
            'Bilingual education',
            'Modern facilities',
            'Extracurricular activities',
            'Personalized attention',
          ],
        },
        activities: {
          title: 'School Activities',
          subtitle: 'Comprehensive development beyond the classroom',
          items: [
            {
              title: 'Sports',
              description: 'Soccer, basketball, volleyball and more',
            },
            {
              title: 'Art and Culture',
              description: 'Music, theater and visual arts',
            },
            {
              title: 'Science and Technology',
              description: 'Robotics, programming and experiments',
            },
            {
              title: 'Workshops',
              description: 'Crafts, cooking and entrepreneurship',
            },
          ],
        },
        news: {
          title: 'News and Announcements',
          subtitle: 'Stay informed about what happens at our school',
          viewAll: 'View all news',
          items: [
            {
              title: 'New School Year Begins',
              date: 'January 15, 2025',
              excerpt: 'We welcome all our students for this new school year full of opportunities...',
            },
            {
              title: 'Science Fair 2025',
              date: 'January 10, 2025',
              excerpt: 'Our students will present their most innovative scientific projects...',
            },
            {
              title: 'New Scholarship Program',
              date: 'January 5, 2025',
              excerpt: 'We announce the opening of our scholarship program for outstanding students...',
            },
          ],
        },
      },
    },
  },
}))
