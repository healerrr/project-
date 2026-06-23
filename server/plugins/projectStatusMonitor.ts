import { defineNitroPlugin } from 'nitropack/runtime'
import { startProjectStatusMonitor } from '../utils/projectStatusMonitor'

export default defineNitroPlugin(() => {
  startProjectStatusMonitor()
})
