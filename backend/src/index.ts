import { env } from 'process'
import { ExpressAppInitializer } from './app'

const app = ExpressAppInitializer.create().app
const port = env.PORT || 3001

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
