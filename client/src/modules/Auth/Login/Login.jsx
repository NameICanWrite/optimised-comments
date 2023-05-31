import * as React from 'react';
import * as Yup from 'yup'



import styles from './Login.module.scss';
import { useFormik } from 'formik';
import TextFields from './LoginFields';


const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

const validationSchema = Yup.object({
   userEmail: Yup.string().email('Invalid email').matches(emailRegex,"Invalid email").required('Email is required'),
   userPassword: Yup.string().required('Password number is required'),
 });

export const Login = ({login, loginError}) => {
   

   const formik = useFormik({
      initialValues: {
        userEmail: '',
        userPassword: '',
      },
      validateOnMount: true,
      validateOnChange: true,
      validationSchema,
      onSubmit: (values) => {
        login({email: values.userEmail, password: values.userPassword})
      },
    });



   return (
      <section id='login' className='container'>
         <h3 className={styles.header}>Login</h3>
         <form className={styles.loginForm} onSubmit={formik.handleSubmit}>
            <TextFields formik={formik} />
            <input
               type="submit"
               className='mainButton'
               value={'Login'}
               disabled={!formik.isValid}
            />
            <p style={{color: 'red', textAlign: 'center', width: '100%'}}>{loginError}</p>
         </form>
      </section>
   );
};
