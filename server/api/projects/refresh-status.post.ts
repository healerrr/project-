import { defineEventHandler } from 'h3'
import { checkProjectProductionStatuses } from '../../utils/projectStatusMonitor'

export default defineEventHandler(async () => {
  return checkProjectProductionStatuses()
})
