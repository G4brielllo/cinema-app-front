import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#424242',
          secondary: '#ffa600ff',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
        },
        
      },
    },
  },
  defaults: {
    global: {
      ripple: false,
    },
    VBtn: {
      color: 'primary',
      variant: 'flat',
      rounded: 'md',
    },
    VTextField: {
      variant: 'outlined',
      color: 'primary',
    },
    VCard: {
      elevation: 2,
      rounded: 'lg',
    },
  },
  display: {
    mobileBreakpoint: 'sm',
    thresholds: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
})