import React, { useEffect, useState } from 'react'
import { API_URL } from '../../consts'
import axios from 'axios'

export default function CreateCommentForm({ parentId, onHide }) {
  const [captcha, setCaptcha] = useState({svg: '', id: ''})
  const [createCommentError, setCreateCommentError] = useState()
  const fetchCaptcha = async () => {
    const { id, svg } = (await axios.get(`${API_URL}/captcha`)).data
    setCaptcha({ id, svg })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/comments`, {
        parentId,
        text: e.target.commentText.value,
        // captchaText: e.target.captcha.value,
        // captchaId: captcha.id
      }, {withCredentials: true})
      setCreateCommentError(undefined)
      onHide()
    } catch (error) {
      console.log(error.response.data);
      setCreateCommentError(error.response.data)
    }
  }

  useEffect(() => {
    fetchCaptcha()
  }, [])

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: captcha.svg }}></div>
      <button onClick={fetchCaptcha}>Change Captcha</button>
      <form style={{display: 'flex', flexDirection: 'column'}} onSubmit={onSubmit}>
        <input type="text" name='captcha' placeholder='Captcha' />
        <textarea name="commentText" cols="30" rows="10"></textarea>
        <button>Confirm</button><button type='button' onClick={onHide}>Cancel</button>
        <p style={{color: 'red', textAlign: 'center', width: '100%'}}>
          {createCommentError}
        </p>
      </form>
      
    </div>
  )
}
