export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "blog",
    htmlAttrs: {
      lang: "pt-BR"
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Open+Sans&display=swap"
      }
    ]
  },

  loading: { color: "#3B8070", failedColor: "red" },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["~assets/styles/main.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ["~plugins/core-components.js", "~plugins/date-filter.js"],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["@nuxtjs/axios"],

  axios: {
    baseURL: "https://nuxt-blog-34a29-default-rtdb.firebaseio.com",
    credentials: false
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  env: {
    baseUrl: "https://nuxt-blog-34a29-default-rtdb.firebaseio.com"
  },

  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        path: "*",
        component: resolve(__dirname, "pages/index.vue")
      });
    }
  },

  transition: {
    name: "fade",
    mode: "out-in"
  }

  // router: {
  //   middleware: "log"
  // }
};
