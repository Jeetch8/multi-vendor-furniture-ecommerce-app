import { createUploadthing, UTFiles, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { auth } from '@/lib/auth';
import { createId } from '@paralleldrive/cuid2';
import slugify from 'slugify';

const f = createUploadthing();

// f(['image']).middleware(async ({ req, files }) => {

//   // Return userId to be used in onUploadComplete
//   return { foo: 'bar' as const, [UTFiles]: fileOverrides };
// });

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 2,
    },
  })
    .middleware(async ({ req, files }) => {
      const session = await auth();
      const user = session?.user;

      if (!user) throw new UploadThingError('Unauthorized');

      const fileOverrides = files.map((file) => {
        const newName = slugify(file.name);
        const myIdentifier = createId();
        return { ...file, name: newName, customId: myIdentifier };
      });

      return { userId: user.id, [UTFiles]: fileOverrides };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.url);

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
