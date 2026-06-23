export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'IT项目管理',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '项目管理中心高保真原型' }
      ],
      script: [
        {
          innerHTML: 'window.$$aaConfig = { uuid: "868622df-ca8a-45fc-8f82-e72f50d3cdb8", url: "https://aipower.yingdao.com/agent/868622df-ca8a-45fc-8f82-e72f50d3cdb8/share", apiUrl: "https://power-api.yingdao.com" }'
        },
        {
          src: 'https://aipower.yingdao.com/embed.min.js',
          defer: true
        }
      ]
    }
  },
  typescript: {
    strict: true
  }
})
