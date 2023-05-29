import SuccessImage from '../../../../assets/success-image.svg';

import styles from './SignupSuccess.module.scss';

export const SignupSuccessMessage = () => (
   <div className={styles.signupSuccess}>
      <p className={styles.signupSuccess__message}>
         Check your email! User successfully signuped
      </p>
      <div className={styles.signupSuccess__image}>
         <img src={SuccessImage} alt="worker succesfully send a file" />
      </div>
   </div>
);
