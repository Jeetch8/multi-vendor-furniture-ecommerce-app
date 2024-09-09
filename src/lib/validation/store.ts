import { z } from 'zod';

const cellphoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;

export const newApplicationSchema = z.object({
  cellphone: z
    .string()
    .min(10, { message: 'Please enter a valid phone number.' }),
  // .string()
  // .regex(cellphoneRegex, { message: 'Please enter a valid phone number.' }),
  address: z
    .string()
    .min(5, { message: 'Address must be at least 10 characters.' })
    .max(100, { message: 'Address cannot exceed 100 characters.' }),
  storename: z
    .string()
    .min(3, { message: 'Store name must be at least 10 characters.' })
    .max(25, { message: 'Store name cannot exceed 50 characters.' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters.' })
    .max(100, { message: 'Description cannot exceed 100 characters.' }),
  img: z
    .string()
    // .min(1, { message: 'You must upload at least 1 image.' })
    .nullable(),
});
