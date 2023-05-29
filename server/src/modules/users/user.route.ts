import { Router, Request, Response, RequestHandler } from 'express';
import { userController } from './user.controller';
import { authAndGetUser } from './auth.middleware';
import TryCatch from '../../utils/try-catch.decorator';
import validator from '../../utils/validation/generic.validator';
import { removeJwtCookie } from '../../utils/jwt.utils';
import redisClient from '../../config/redis';

const router: Router = Router();

// @route   POST api/user
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
// router.post('/signup', AddAuthToken(userController.signup.bind(userController)));

//login-signup functionality
router.get('/activate/:token', 
  authAndGetUser,
  userController.redirectIfUserExists
);
router.post('/signup-and-send-activation-email', 
  validator.isBodyValidEntity('signup'),
  userController.signUpAndSendActivationEmail
)
router.post('/login', 
  validator.isBodyValidEntity('login'),
  userController.login
)
router.post('/logout', authAndGetUser, userController.logout)

//edit user functionality
router.post('/set-avatar', authAndGetUser, userController.setAvatar)
router.post('/set-homepage', authAndGetUser, userController.setHomepage)

//fetch functionality
router.get('/current', authAndGetUser, userController.getCurrentUser)
router.get('/current/comments', authAndGetUser, userController.getCurrentUserComments)

export default router;
