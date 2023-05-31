

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Comments } from './modules/Comments/Comments';
import { Signup } from './modules/Auth/Signup/Signup';
import { SignupSuccessMessage } from './modules/Auth/Signup/SignupSuccess/SignupSuccess';
import { API_URL, COMMENTS_ON_PAGE, WEBSOCKET_API_URL } from './consts';
import axios from 'axios'
import { useLocation } from 'react-router-dom';
import { useScrollToAnchor } from './utils/useScrollToAnchor.hook';
import Navbar from './modules/Top/Navbar';
import Banner from './modules/Top/Banner';
import {Profile} from './modules/Profile/Profile'
import { Login } from './modules/Auth/Login/Login';

function App() {
   const [currentUser, setCurrentUser] = useState(null)

   const [isSignupSuccess, setIsSignupSuccess] = useState(false)
   const [isLoginSuccess, setIsLoginSuccess] = useState(false)
   const [signupError, setSignupError] = useState('')
   const [loginError, setLoginError] = useState('')
   const [editAvatarError, setEditAvatarError] = useState('')
   const [editHomepageError, setEditHomepageError] = useState('')

   const [comments, setComments] = useState([])

   const commentSortFields = [
      'user.name',
      'user.email',
      'comment.createdAt',
    ]
   const [commentSortField, setCommentSortField] = useState('comment.createdAt')
   const [isCommentSortAscending, setIsCommentSortAscending] = useState(false)

   const [commentsDisplayedPage, setCommentsDisplayedPage] = useState(1)
   const [commentsLastPage, setCommentsLastPage] = useState(0)
   const [totalComments, setTotalComments] = useState(0)
   const [isCommentsLoading, setIsCommentsLoading] = useState(false)


   const fetchCurrentUser = async () => {
      const user = (await axios.get(`${API_URL}/user/current`, {withCredentials: true})).data
      setCurrentUser(user)
   }

   const fetchCommentsNextPage = async (arg) => {
      setIsCommentsLoading(true)

      let prevCommentsLastPage = 0
      let prevComments = []
      if (!arg?.shouldCollapse) {
         prevCommentsLastPage = commentsLastPage
         prevComments = comments
      } else {
         setCommentsDisplayedPage(1)
      }
      const {comments: nextComments, totalComments} = (await axios.get(`${API_URL}/comments?`+
      `page=${prevCommentsLastPage + 1}&` + 
      `limit=${COMMENTS_ON_PAGE}&` + 
      `isSortAscending=${isCommentSortAscending}&` + 
      `sortField=${commentSortField}`
      )).data
      
      setTotalComments(totalComments)
      setComments([...prevComments, ...nextComments])
      setCommentsLastPage(prevCommentsLastPage + 1)

      setIsCommentsLoading(false)
   }


   const signup = async ({ email, name, password }) => {
      try {
         await axios.post(`${API_URL}/user/signup-and-send-activation-email`,
            { email, name, password },
            { withCredentials: true }
         )
         setIsSignupSuccess(true)
      } catch (error) {
         console.log(error.response.data.message);
         setSignupError(error.response.data.message)
      }
   }

   const login = async ({ email, password }) => {
      try {
         await axios.post(`${API_URL}/user/login`,
            { email, password },
            { withCredentials: true }
         )
         setIsLoginSuccess(true)
         console.log('logged in');
      } catch (error) {
         console.log(error.response.data);
         setLoginError(error.response.data)
      }
   }

   const logout = async () => {
      await axios.post(`${API_URL}/user/logout`, {}, {withCredentials: true})
      setCurrentUser(null)
      setIsLoginSuccess(false)
      setIsSignupSuccess(false)
   }

   const editAvatar = async (avatar) => {
      let formData = new FormData();
      formData.append('avatar', avatar)
      try {
         await axios.post(`${API_URL}/user/set-avatar`, 
            formData, 
            { 
               headers: { 'Content-Type': 'multipart/form-data' } ,
               withCredentials: true
         })
         setEditAvatarError('')
         fetchCurrentUser()
         fetchCommentsNextPage({shouldCollapse: true})
      } catch (error) {
         console.log(error.response.data);
         setEditAvatarError(error.response.data)
      }
   }

   const editHomepage = async (homepage) => {
      console.log(homepage);
      try {
         await axios.post(`${API_URL}/user/set-homepage`, {homepage}, {withCredentials: true })
         setEditAvatarError('')
         fetchCurrentUser()
         fetchCommentsNextPage({shouldCollapse: true})
      } catch (error) {
         console.log(error.response.data);
         setEditAvatarError(error.response.data)
      }
   }

   const addNewCommentToState = (comment) => {
      const findCommentParent = (comments, parentId) => {
         let parent
         comments.forEach(comment => {
            if (parent) return
            if (comment.id === parentId) parent = comment 
            else parent = findCommentParent(comment.replies || [], parentId)
         })
         return parent
      }

      if (comments) {
         console.log(comment);
         if (!comment?.parent?.id) {
            setComments([comment, ...comments]);
         } else {
            const newCommments = [...comments]
            const parent = findCommentParent(comments, comment.parent.id)
            
            parent.replies = [comment, ...parent.replies]
            setComments(newCommments)
         }
      }
   }

   useEffect(() => {
      const socket = new WebSocket(WEBSOCKET_API_URL);

      socket.onopen = () => console.log('WebSocket connection open')
  
      // WebSocket message handler
      socket.onmessage = ({data: rawData}) => {
         const {event, data} = JSON.parse(rawData)
         if (event === 'newComment') {
            addNewCommentToState(data)
         }
      };
  
      // WebSocket close handler
      socket.onclose = () => {
        console.log('WebSocket connection closed');
      };
  
      // Clean up WebSocket connection on component unmount
      return () => {
        socket.close();
      };
    }, [addNewCommentToState]);

   //  useEffect(() => {
   //    console.log(comments);
   //  }, [comments])


   useEffect(() => {
      fetchCommentsNextPage()
      fetchCurrentUser()
   }, [])

   useEffect(() => {
      fetchCommentsNextPage({shouldCollapse: true})
   }, [commentSortField, isCommentSortAscending])

   useEffect(() => {
      isLoginSuccess && fetchCurrentUser()
   }, [isLoginSuccess])

   useEffect(() => {
      if ((commentsDisplayedPage !== 1) && (commentsDisplayedPage > commentsLastPage)) {
         fetchCommentsNextPage()
      }
   }, [commentsDisplayedPage])


   //scroll to anchor on reload
   const { hash } = useLocation();
   const scrollToAnchor = useScrollToAnchor()
   useEffect(() => {
      scrollToAnchor(hash.substring(1))
   }, []);

   return (
      <>
         {/* <Navbar isSignupSuccess={isSignupSuccess} /> */}
         

         <Comments
            comments={comments}
            totalComments={totalComments}
            fetchCommentsNextPage={fetchCommentsNextPage}
            isCommentsLoading={isCommentsLoading}
            commentSortField={commentSortField}
            setCommentSortField={setCommentSortField}
            isCommentSortAscending={isCommentSortAscending}
            setIsCommentSortAscending={setIsCommentSortAscending}
            commentsDisplayedPage={commentsDisplayedPage}
            setCommentsDisplayedPage={setCommentsDisplayedPage}
         />
         {
            currentUser ?
               <Profile
                  user={currentUser}
                  editAvatar={editAvatar}
                  editAvatarError={editAvatarError}
                  editHomepage={editHomepage}
                  editHomepageError={editHomepageError}
                  logout={logout}
               />
               :
               isSignupSuccess ?
                  <SignupSuccessMessage />
                  :
                  <>
                     <Signup signup={signup} signupError={signupError}/>
                     <Login login={login} loginError={loginError}/>
                  </>
         }
      </>
   );
}

export default App;
