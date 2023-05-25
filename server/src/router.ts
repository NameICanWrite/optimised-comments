import { Application } from 'express';
import commentsRouter from './modules/comments/comments.route';
import userRouter from './modules/users/user.route';

class AppRouter {
  constructor(private app: Application) {}

  init() {
    this.app.get('/', (_req, res) => {
      res.send('API Running');
    });
    this.app.use('/api/comments', commentsRouter);
    this.app.use('/api/user', userRouter);
  }
}

export default AppRouter;
