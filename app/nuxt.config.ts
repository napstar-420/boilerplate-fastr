export default defineNuxtConfig({
  modules: ['@nuxtjs/apollo', 'nuxt-quasar-ui'],
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      GRAPHQL_URL: process.env.GRAPHQL_URL,
      ID_CLIENT: process.env.ID_CLIENT,
      ID_URL: process.env.ID_URL,
    },
  },
  apollo: {
    authType: 'Bearer',
    authHeader: 'Authorization',
    tokenStorage: 'cookie',
    proxyCookies: true,
    clients: {
      default: {
        httpEndpoint: process.env.GRAPHQL_URL!,
      },
    },
  },
  srcDir: 'src',
  ssr: false,
  quasar: {
    //
  },
});
