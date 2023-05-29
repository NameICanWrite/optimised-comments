import React from 'react'
import styles from './Comments.module.scss';
import { InputLabel } from '@mui/material';
import { Comments } from './Comments';
import emptyAvatar from '../../assets/emptyAvatar.jpg'

export default function Comment({ id, text, createdAt, user, replies, deepness }) {
  return (
    <li className={styles.comments__container}>
      <div className={styles.comments__avatar}>
        <img src={user.avatarUrl || emptyAvatar} alt='avatar' style={{height: '30px', width: '30px'}} />
      </div>
      <p className={styles.comments__name}>User: {user.name}</p>
      <div>
        {/* <p className={styles.comments__position}>{position}</p>
        <p className={`${styles.comments__email} tooltip`}>
          <InputLabel>{user.email}</InputLabel>
          <span className='tooltipContent'>{user.email}{' '}</span>
        </p> */}
        <p className={styles.createdAt}>{createdAt}</p>
        <p className={styles.text}>Comment Text: {text}</p>
        <hr />
        <Comments parentId={id} comments={replies} deepness={deepness} />
      </div>
    </li>
  )
}
