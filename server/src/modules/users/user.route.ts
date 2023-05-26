import { Router, Request, Response } from 'express';
import { userController } from './user.controller';
import { AddAuthToken, authAndGetUser } from './auth.middleware';
import TryCatch from '../../utils/try-catch.decorator';
import validator from '../../utils/validation/generic.validator';

const router: Router = Router();

// @route   POST api/user
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
// router.post('/signup', AddAuthToken(userController.signup.bind(userController)));

//login-signup functionality
router.get('/activate/:token', 
  authAndGetUser,
  userController.activateUserAndRedirectToFrontend
);
router.post('/signup-and-send-activation-email', 
  validator.isBodyValidEntity('signup'),
  TryCatch(userController.signUpAndSendActivationEmail)
)
router.post('/login', 
  validator.isBodyValidEntity('login'),
  AddAuthToken(userController.login)
)

//edit user functionality
router.post('/send-password-reset-code', 
  validator.isBodyValidEntity('withEmail'),
  TryCatch(userController.sendResetPasswordCodeEmail)
)
router.post('/reset-password', 
  validator.isBodyValidEntity('resetPassword'),
  TryCatch(userController.resetPasswordWithCode)
)
router.post('/set-avatar', authAndGetUser, TryCatch(userController.setAvatar))
router.post('/set-homepage', authAndGetUser, TryCatch(userController.setHomepage))

//fetch functionality
router.get('/current', authAndGetUser, TryCatch(userController.getCurrentUser))
router.get('/current/comments', authAndGetUser, TryCatch(userController.getCurrentUserComments))


// router.post('/change-password-secure', authAndGetUser, TryCatch(userController.changePasswordSecure.bind(userController)))
// router.post('/change-password', authAndGetUser, TryCatch(userController.changePassword.bind(userController)))
export default router;
