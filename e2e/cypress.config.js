const { defineConfig } = require('cypress')

module.exports = defineConfig({
  env: {
    backendUrl: process.env.BACKEND_URL || 'http://localhost:8080',
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
