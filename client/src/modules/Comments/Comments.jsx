import * as React from 'react';
import { Box, CircularProgress, InputLabel, Typography } from '@mui/material';
import { useEffect } from 'react';

import logo from '../../assets/photo-cover.svg';

import styles from './Comments.module.scss';
import Comment from './Comment';
import CreateCommentForm from './CreateCommentForm';

export const Comments = ({ isCommentsLoading, fetchCommentsNextPage, comments, deepness, parentId }) => {
   const [showCreateCommentForm, setShowCreateCommentForm] = React.useState(false)
   

    return (
      <section id='comments' 
      // className='container'
      className='comments'
      >
         <button onClick={() => setShowCreateCommentForm(true)}>
            {deepness ? 'Reply' : 'Create Comment'}
         </button>
         {
            showCreateCommentForm &&
               <CreateCommentForm
                  parentId={parentId} 
                  onHide={() => setShowCreateCommentForm(false)}
               />
         }

         <div className={styles.comments}>
            {comments.length ? comments.map((props) => <Comment deepness={deepness ? deepness + 1 : 1} key={props.id} {...props} />) : ''}
         </div>
         {isCommentsLoading && (
            <div className={styles.loading}>
               <CircularProgress />
            </div>)
         }
         {!deepness && <button className={`${styles.more} mainButton`} onClick={fetchCommentsNextPage}>
            Show more
         </button>}
      </section>
   );
};
