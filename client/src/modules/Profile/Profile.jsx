import * as React from 'react';
import * as Yup from 'yup'



import styles from './Profile.module.scss';
import { useFormik } from 'formik';
import ImageUpload from './EditAvatarForm';
import emptyAvatar from '../../assets/emptyAvatar.jpg'
import EditAvatarForm from './EditAvatarForm';

export const Profile = ({user, editAvatar, editAvatarError, editHomepage, editHomepageError, logout}) => {
   const onHomepageSubmit = (e) => {
      e.preventDefault()
      editHomepage(e.target.homepage.value)
   }

   return (
      <section id='profile' className='container'>
         <h3 className={styles.header}>User Profile</h3>
         <p>Email: <b>{user.email}</b></p>
         <p>Username: <b>{user.name}</b></p>
         <p>Homepage: {user.homepage ? <a href={user.homepage}>{user.homepage}</a> : 'Not set'}</p>
         <p style={{color: 'red', textAlign: 'center', width: '100%'}}>
            {editHomepageError || ''}
         </p>
         <form onSubmit={onHomepageSubmit}>
            <input type="text" name='homepage' placeholder='Homepage'/>
            <button>Edit homepage</button>
         </form>
         <br />
         <img className={styles.avatar} src={user.avatarUrl || emptyAvatar} alt="avatar" />
         <EditAvatarForm editAvatar={editAvatar}/>
         <p style={{color: 'red', textAlign: 'center', width: '100%'}}>
            {editAvatarError || ''}
         </p>

         <button onClick={logout}>Logout</button>
      </section>
   );
};
