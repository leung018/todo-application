import { env } from 'process'
import { ExpressAppFactory } from './app'
import { newApplicationContextFromEnv } from './context'

const port = env.PORT || 8080

ExpressAppFactory.createApp(newApplicationContextFromEnv())
  .then((app) => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  })
  .catch((err) => {
    console.error('Error encountered when starting server', err)
    process.exit(1)
  })
