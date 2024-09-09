// import { NextResponse } from 'next/server';
// import { v2 as cloudinary } from 'cloudinary';
// import { createId } from '@paralleldrive/cuid2';

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(req: Request) {
//   try {
//     const { files } = await req.json();

//     if (!Array.isArray(files) || files.length === 0) {
//       return NextResponse.json(
//         { error: 'Files array is required' },
//         { status: 400 }
//       );
//     }

//     const timestamp = new Date().getTime();

//     const uploadPromises = files.map(async ({ filename }) => {
//       // Generate a unique public_id using the filename
//       const public_id = `${timestamp}-${createId()}`;

//       // Generate the signature
//       const signature = cloudinary.utils.api_sign_request(
//         {
//           folder: 'ecommerce',
//           public_id,
//           timestamp,
//         },
//         process.env.CLOUDINARY_API_SECRET!
//       );
//       console.log(signature, 'signature');

//       return {
//         signature,
//         timestamp,
//         public_id,
//         cloudName: process.env.CLOUDINARY_CLOUD_NAME,
//         apiKey: process.env.CLOUDINARY_API_KEY,
//         url: cloudinary.url(public_id, {
//           secure: true,
//           resource_type: 'image',
//         }),
//       };
//     });

//     const uploadData = await Promise.all(uploadPromises);

//     return NextResponse.json(uploadData);
//   } catch (error) {
//     console.error('Error generating upload signatures:', error);
//     return NextResponse.json(
//       { error: 'Failed to generate upload signatures' },
//       { status: 500 }
//     );
//   }
// }

import { createRouteHandler } from 'uploadthing/next';

import { ourFileRouter } from './core';

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});
