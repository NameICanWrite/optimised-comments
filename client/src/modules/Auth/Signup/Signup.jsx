import * as React from 'react';
import * as Yup from 'yup'



import styles from './Signup.module.scss';
import { useFormik } from 'formik';
import SignupTextFields from './SignupTextFields';


const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

const validationSchema = Yup.object({
   userName: Yup.string().min(2, 'Must be 2 characters or longer').required('Name is required'),
   userEmail: Yup.string().email('Invalid email').matches(emailRegex,"Invalid email").required('Email is required'),
   userPassword: Yup.string().required('Password number is required'),
 });

export const Signup = ({signup, signupError}) => {
   

   const formik = useFormik({
      initialValues: {
        userName: '',
        userEmail: '',
        userPassword: '',
      },
      validateOnMount: true,
      validateOnChange: true,
      validationSchema,
      onSubmit: (values) => {
        signup({
         name: values.userName.trim(),
         email: values.userEmail,
         password: values.userPassword,
      })
      },
    });



   return (
      <section id='signup' className='container'>
         <h3 className={styles.header}>Working with POST request</h3>
         <form className={styles.signupForm} onSubmit={formik.handleSubmit}>
            <SignupTextFields formik={formik} />
            <input
               type="submit"
               className='mainButton'
               value={'Sign up'}
               disabled={!formik.isValid}
            />
            <p style={{color: 'red', textAlign: 'center', width: '100%'}}>{signupError}</p>
         </form>
      </section>
   );
};
