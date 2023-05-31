import React, { useState } from 'react'
import styles from './Comments.module.scss';
import { InputLabel } from '@mui/material';
import { Comments } from './Comments';
import emptyAvatar from '../../assets/emptyAvatar.jpg'
import CreateCommentForm from './CreateCommentForm';

export default function Comment({ id, text, createdAt, user, replies, deepness, currentUser, files }) {
  const [showCreateReplyForm, setShowCreateReplyForm] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  return (
    <>
      <div className={styles.comments__container}>
        <p className={styles.createdAt}>{new Date(createdAt).toLocaleString()}</p>
        <div className={styles.comments__top}>
          <div className={styles.comments__avatar}>
            <img src={user.avatarUrl || emptyAvatar} alt='avatar' />
          </div>
          <div className={styles.comments__user}>
            <p className={styles.comments__name}>{user.name}</p>
            <p className={styles.comments__email}>{user.email}</p>
          </div>
        </div>
        <div className={styles.comments__text}>
          <p dangerouslySetInnerHTML={{__html: text}}></p>
          {
            files && files.map && files.map(({type, url}, index) => {
              if (type === 'image') {
                return (<img className={styles.contentImage} src={url} alt="" key={index}/>)
              } 
              if (type === 'text') {
                return (<a href={url} className={styles.fileDownloadIcon} key={index}></a>)
              }
            })
          }
        </div>
        
      </div>
      <div>
        <div className={styles.showReplies}>
          {!showCreateReplyForm && <button onClick={() => currentUser ? setShowCreateReplyForm(true) : scrollToAnchor('login')}>
            Reply
          </button>}
          {
            replies.length ?
              <button onClick={() => setShowReplies(!showReplies)}>
                {!showReplies ? 'Show' : 'Hide'} replies {!showReplies ? `(${replies.length})` : ''}
              </button> : ''
          }
          
        </div>
        <hr />
        {
            showCreateReplyForm && currentUser &&
            <CreateCommentForm
               parentId={id}
               onHide={() => setShowCreateReplyForm(false)}
            />
         }
        {showReplies && <Comments parentId={id} comments={replies} deepness={deepness} currentUser={currentUser} />}
      </div>
    </>

  )
}
