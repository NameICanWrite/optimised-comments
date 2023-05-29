import * as React from 'react';
import { Box, CircularProgress, InputLabel, Typography } from '@mui/material';
import { useEffect } from 'react';

import logo from '../../assets/photo-cover.svg';

import styles from './Comments.module.scss';
import Comment from './Comment';
import CreateCommentForm from './CreateCommentForm';
import { COMMENTS_ON_PAGE } from '../../consts';

export const Comments = ({
   isCommentsLoading,
   fetchCommentsNextPage,
   isCommentSortAscending,
   setIsCommentSortAscending,
   commentSortField,
   setCommentSortField,
   comments,
   totalComments,
   commentsDisplayedPage: page,
   setCommentsDisplayedPage: setPage,
   deepness = 0,
   parentId,
}) => {
   const [showCreateCommentForm, setShowCreateCommentForm] = React.useState(false)

   const from = (page - 1) * COMMENTS_ON_PAGE
   const to = (page - 1) * COMMENTS_ON_PAGE + COMMENTS_ON_PAGE
   const hasNextPage = totalComments >= COMMENTS_ON_PAGE * page

   return (
      <section id='comments'
         // className='container'
         className='comments'
      >
         {
            deepness === 0 &&
            <div>
               <button onClick={() => setIsCommentSortAscending(!isCommentSortAscending)}>
                  Set sort direction as {isCommentSortAscending ? 'Descending' : 'Ascending'}
               </button>
               <p>Set sort field as</p>
               <button onClick={() => setCommentSortField('user.name')} className={commentSortField === 'user.name' ? 'mainButton' : ''}>
                  User Name
               </button>
               <button onClick={() => setCommentSortField('user.email')} className={commentSortField === 'user.email' ? 'mainButton' : ''}>
                  User Email
               </button>
               <button onClick={() => setCommentSortField('comment.createdAt')} className={commentSortField === 'comment.createdAt' ? 'mainButton' : ''}>
                  Created At
               </button>
            </div>
         }
         <button onClick={() => setShowCreateCommentForm(true)}>
            {deepness === 0 ? 'Create Comment' : 'Reply'}
         </button>
         {
            showCreateCommentForm &&
            <CreateCommentForm
               parentId={parentId}
               onHide={() => setShowCreateCommentForm(false)}
            />
         }

         <div className={styles.comments}>
            {
               deepness === 0
                  ?
                  <>{comments.length ? comments.map((props) => <Comment deepness={deepness ? deepness + 1 : 1} key={props.id} {...props} />).slice(from, to) : ''}</>
                  :
                  <>{comments.length ? comments.map((props) => <Comment deepness={deepness ? deepness + 1 : 1} key={props.id} {...props} />) : ''}</>
            }
         </div>
         {isCommentsLoading && (
            <div className={styles.loading}>
               <CircularProgress />
            </div>)
         }
         {!deepness && (
            <div>
               <button className={`mainButton`} onClick={() => setPage(page - 1)} disabled={page === 1}>
                  {page - 1 > 0 && `(${page - 1})`} {'<'}=prev
               </button>
               <span> current page: {page} </span>
               <button className={`mainButton`} onClick={() => setPage(page + 1)} disabled={!hasNextPage}>
                  next={'>'} {hasNextPage && `(${page + 1})`}
               </button>
            </div>)}
      </section>
   );
};
