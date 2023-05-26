import { UploadedFile } from "express-fileupload";
import admin from "firebase-admin";
import {ref, uploadBytes, getStorage, getDownloadURL} from "firebase/storage"
import {v4 as uuid} from 'uuid'
// Initialize Firebase
const app = admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_PRIVATE_KEY)),
  storageBucket: "my-test-tasks.appspot.com",
});

const storage = admin.storage(app)
const bucket = storage.bucket()

export async function uploadAvatarToFirebase(avatar: UploadedFile, userId: number) {
  const fileRef = bucket.file(`avatars/${userId}/${uuid() + avatar.name}`)
  await fileRef.save(avatar.data)
  const [url] = await fileRef.getSignedUrl({
    action: 'read',
    expires: '03-01-2500', // Specify the desired expiration date or duration
  });
  console.log('avatarurl = ' + url)
  return url
}

export async function deleteAvatarFromFirebase(userId: number) {
  const [files] = await bucket.getFiles({ prefix: `avatars/${userId}` })
  await files[0]?.delete()
}



