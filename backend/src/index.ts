import { env } from 'process'
import { ExpressAppInitializer } from './app'
import { newPostgresContextFromEnv } from './repositories/util'

const port = env.PORT || 8080

ExpressAppInitializer.create({
  postgresContext: newPostgresContextFromEnv(),
})
  .then((initializer) => {
    initializer.app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  })
  .catch((err) => {
    console.error('Error encountered when starting server', err)
    process.exit(1)
  })
