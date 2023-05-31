import Queue, {QueueOptions} from 'bull';
import { sendMail } from '../../config/mailer';
import dotenv from 'dotenv'

const emailQueue = new Queue('email', process.env.REDIS_URL, {
  
});

emailQueue.process('sendActivationEmail', async (job, done) => {
  const { email, link } = job.data;
  console.log(`sending email to ${email} ...`);
  try {
    if (job.attemptsMade < 3) throw new Error('attempt ' + (job.attemptsMade + 1))
    await sendMail({
    subject: 'Comment App Signup Confirmation',
    email,
    html: `
      <p>Follow this link to signup</p>
      <a href="${link}">${link}</a>
    `,
    text: ''
  })
  console.log(`email sent to ${email}`);
  return done()
} catch (err: any) {
  console.log(err.message);
  done(new Error(err.message))
}
});

export { emailQueue }