import { z } from 'zod'

export const registerFormSchema = z.object({
    name: z.string().min(1, 'Invalid Name'),
    email: z.string().email(),
    contact_no: z
        .string()
        .min(10, 'Invalid Phone Number')
        .max(10, 'Invalid Phone Number'),
    uni_id: z.string(),
    uni_name: z.string(),
    where_you_reside: z.string().min(1, 'Invalid Address'),
})

export type RegisterForm = z.infer<typeof registerFormSchema>
