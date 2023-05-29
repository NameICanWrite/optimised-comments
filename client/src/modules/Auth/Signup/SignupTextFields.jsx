import React from 'react'
import styles from './Signup.module.scss';
import { CustomTextField } from '../../mui/TextField';

export default function SignupTextFields({ formik }) {

  const didTouchAnyField = formik.touched.userName || formik.touched.userEmail || formik.touched.userPhone
  const getHelperTextAndErrorProps = ({ alias, defaultHelperText }) => ({
    helperText: (formik.errors[alias] && (!!formik.values[alias] || didTouchAnyField)) ? formik.errors[alias] : (defaultHelperText || ' '),
    error: !!formik.errors[alias] && (!!formik.values[alias] || didTouchAnyField),
  })
  return (
    <div className={styles.textInputs}>
      <CustomTextField
        className={styles.textInput}
        variant="outlined"
        label="Your name"
        {...{
          ...formik.getFieldProps('userName'),
          ...getHelperTextAndErrorProps({ alias: 'userName' })
        }}
        required
      />
      <CustomTextField
        className={styles.textInput}
        variant="outlined"
        label="Email"
        {...{
          ...formik.getFieldProps('userEmail'),
          ...getHelperTextAndErrorProps({ alias: 'userEmail' })
        }}
        required
      />
      <CustomTextField
        className={styles.textInput}
        label="userPassword"
        variant="outlined"
        {...{
          ...formik.getFieldProps('userPassword'),
          ...getHelperTextAndErrorProps({ alias: 'userPhone', defaultHelperText: '1234' })
        }}
        required
      />
    </div>
  )
}
