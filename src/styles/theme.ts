export const theme = {
  colors: {
    brand: {
      gradient: 'bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800',
      radialGradient: '[background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#e0effe_100%)]',
      title: 'text-blue-900 dark:text-white',
      accent: 'text-blue-600 dark:text-blue-500',
    },
    text: {
      primary: 'text-blue-900 dark:text-white',
      secondary: 'text-gray-600 dark:text-gray-300',
      accent: 'text-blue-600 dark:text-blue-400',
    },
    button: {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white transition-colors',
      secondary: 'bg-white text-blue-600 border-2 border-blue-100 hover:border-blue-200 transition-colors',
    },
    background: {
      primary: 'bg-white dark:bg-gray-900',
      secondary: 'bg-blue-50 dark:bg-gray-800',
      glass: 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm',
    },
    border: {
      light: 'border-blue-100 dark:border-gray-700',
      medium: 'border-blue-200 dark:border-gray-600',
    },
    status: {
      success: {
        bg: 'bg-green-50 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-300',
      },
      error: {
        bg: 'bg-red-50 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-300',
      }
    }
  },
  components: {
    header: 'fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-blue-100 dark:border-gray-700',
    button: {
      base: 'px-8 py-4 font-semibold rounded-full transition-colors',
      sizes: {
        sm: 'px-6 py-3 text-sm',
        md: 'px-8 py-4',
        lg: 'px-10 py-5 text-lg'
      }
    },
    input: 'w-full px-4 py-3 rounded-full border-2 border-blue-100 dark:border-gray-700 focus:outline-none focus:border-blue-200 dark:focus:border-gray-600 bg-white dark:bg-gray-800 text-blue-900 dark:text-white',
    card: 'bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-blue-100 dark:border-gray-700',
    container: 'bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8'
  }
} as const;
