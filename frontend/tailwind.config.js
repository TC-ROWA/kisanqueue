export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        
        forest: {
          50: '#EEF4F0',
          100: '#D6E6DB',
          200: '#AFCDB8',
          300: '#82AE8F',
          400: '#579068',
          500: '#37704A',
          600: '#28583A',
          700: '#1F5138',
          800: '#173D2A',
          900: '#102B1D'
        },
        cream: {
          50: '#FEFDFB',
          100: '#FBF8F1',
          200: '#F5EEDD',
          300: '#EDE1C4'
        },
        harvest: {
          400: '#E3B341',
          500: '#D6A02A'
        },
        charcoal: '#2B2A27',
        rust: '#C15B3C'
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        card: '16px'
      },
      boxShadow: {
        soft: '0 2px 10px rgba(23, 61, 42, 0.08)',
        lift: '0 8px 24px rgba(23, 61, 42, 0.12)'
      }
    }
  },
  plugins: []
}
