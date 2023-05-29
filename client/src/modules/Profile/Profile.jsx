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

         <h3>Email</h3>
         <p>{user.email}</p>

         <h3>User Name</h3>
         <p>{user.name}</p>

         <img src={user.avatarUrl || emptyAvatar} alt="avatar" />
         <EditAvatarForm editAvatar={editAvatar}/>
         <p style={{color: 'red', textAlign: 'center', width: '100%'}}>
            {editAvatarError || ''}
         </p>

         <h3>Homepage</h3>
         {user.homepage ? <a href={user.homepage}>{user.homepage}</a> : <p>Not set</p>}
         <form onSubmit={onHomepageSubmit}>
            <input type="text" name='homepage' placeholder='Homepage'/>
            <button>Edit homepage</button>
         </form>

         <p style={{color: 'red', textAlign: 'center', width: '100%'}}>
            {editHomepageError || ''}
         </p>

         <button onClick={logout}>Logout</button>
      </section>
   );
};
