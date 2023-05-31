import React, { useEffect, useRef, useState } from 'react'
import { API_URL, MAX_FILES_IN_COMMENT } from '../../consts'
import axios from 'axios'

export default function CreateCommentForm({ parentId, onHide }) {
  const [captcha, setCaptcha] = useState({svg: '', id: ''})
  const [createCommentError, setCreateCommentError] = useState()
  const [text, setText] = useState('')
  const fetchCaptcha = async () => {
    const { id, svg } = (await axios.get(`${API_URL}/captcha`)).data
    setCaptcha({ id, svg })
  }

  const fileInputRef = useRef(null);

  const onSubmit = async (e) => {
    e.preventDefault()
    const validTagsRegex = /<(a|code|i|strong)(\s+\w+="[^"]*")*>.*<\/\1>|^[^<>]+$/;
    const isValid = validTagsRegex.test(e.target.commentText.value);
  
    if (!isValid) {
      setCreateCommentError("Invalid HTML tags detected");
      return;
    }

    const formData = new FormData()

    parentId && formData.append('parentId', parentId)
    formData.append('text', text)
    formData.append('captchaText', e.target.captcha.value)
    formData.append('captchaId', captcha.id)

    Array.from(fileInputRef.current.files).forEach((file, index) => index < MAX_FILES_IN_COMMENT && formData.append('file' + index, file))

    try {
      await axios.post(`${API_URL}/comments`, formData, {
        withCredentials: true, 
        headers: { 'Content-Type': 'multipart/form-data' } 
      })
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
        <div>
          <button type="button" onClick={() => setText(text + '<a href="" title=""></a>')}>&lt;a&gt;</button>
          <button type="button" onClick={() => setText(text + '<code></code>')}>&lt;code&gt;</button>
          <button type="button" onClick={() => setText(text + '<i></i>')}>&lt;i&gt;</button>
          <button type="button" onClick={() => setText(text + '<strong></strong>')}>&lt;strong&gt;</button>
        </div>
        <textarea 
          name="commentText" 
          cols="30" 
          rows="10"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <p>You can also add up to 2 files: .txt, .png, .jpg/.jpeg, .gif</p>
        <input ref={fileInputRef} type="file" multiple accept="image/png, image/jpeg, image/gif, text/plain"/>
        <button>Confirm</button><button type='button' onClick={onHide}>Cancel</button>
        <p style={{color: 'red', textAlign: 'center', width: '100%'}}>
          {createCommentError}
        </p>
      </form>
      
    </div>
  )
}
