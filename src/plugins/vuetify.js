import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          primary: "#424242",
          secondary: "#ffa600ff",
        },
      },
    },
  },
  defaults: {
    global: {
      ripple: false,
      style: {
        fontFamily: "Montserrat, sans-serif",
      },
    },
    VTextField: {
      class: "ml-8 mr-8",
      variant: "underlined",
      color: "primary",
      density: "comfortable",
    },
    VBtn: {
      style: "text-transform: none",
      rounded: "xl",
    },
    VCard: {
      rounded: "xl",
    },
    VContainer: {
      class: "d-flex justify-center align-center",
    },
    VCardTitle: {
      class: "d-flex justify-space-between align-center",
    },
    VSelect: {
      variant: "underlined",
      density: "comfortable",
    },
    VDateInput: {
      variant: "underlined",
    },
    VFileInput: {
      variant: "underlined",
    },
    VToolbar: {
      style: {
        fontFamily: "Montserrat, sans-serif",
      },
    },
  },

  //   blueprint: {
  //     defaults: {
  //       VBtn: {
  //         fontFamily: "Montserrat",
  //         fontWeight: 700,
  //       },
  //     },
  //   },
  display: {
    mobileBreakpoint: "sm",
    thresholds: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});
