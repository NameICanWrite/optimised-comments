import { Application } from 'express';
import commentsRouter from './modules/comments/comments.route';
import userRouter from './modules/users/user.route';
import captchaRouter from './modules/captcha/captcha.route';

class AppRouter {
  constructor(private app: Application) {}

  init() {
    this.app.get('/', (_req, res) => {
      res.send('API Running');
    });
    this.app.use('/api/comments', commentsRouter);
    this.app.use('/api/user', userRouter);
    this.app.use('/api/captcha', captchaRouter)
  }
}

export default AppRouter;
