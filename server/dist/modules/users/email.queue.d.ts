import Queue from 'bull';
declare const emailQueue: Queue.Queue<any>;
export { emailQueue };
