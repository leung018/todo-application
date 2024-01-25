import { ExpressAppInitializer } from './app'

const app = ExpressAppInitializer.create().app
const port = 3001

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
