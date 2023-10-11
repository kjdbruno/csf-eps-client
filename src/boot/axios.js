import { boot } from 'quasar/wrappers'
import axios from 'axios'

// const server = axios.create({ baseURL: 'http://localhost:8000' })
const server = axios.create({ baseURL: 'https://api.sanfernandocity.gov.ph' })
server.defaults.withCredentials = true

export default boot(({ app }) => {
  app.config.globalProperties.$server = server
})

export { server }
