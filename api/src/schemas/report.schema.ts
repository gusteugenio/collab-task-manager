import { z } from 'zod'

export const getReportSchema = z.object({
  periodInDays: z.coerce.number().min(1).optional().default(7)
})
