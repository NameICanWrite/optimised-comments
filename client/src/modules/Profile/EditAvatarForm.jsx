import React, { useEffect, useState } from 'react'

import styles from './Profile.module.scss';
import { CustomInputLabel } from '../mui/InputLabel';
import { CustomOutlinedInput } from '../mui/OutlinedInput';
import { getFileName } from '../../utils/getFileName';

export default function EditAvatarForm({editAvatar}) {
  const [selectedFile, setSelectedFile] = useState()
  const [preview, setPreview] = useState()


  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return
    }
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const onSelectFile = e => {
    const file = e.target.files[0]
    if (!file) {
      setSelectedFile(undefined)
      return
    }
    console.log(file)
    setSelectedFile(file)
  }

  const onSubmit = event => {
    event.preventDefault()
    if (selectedFile) {
      console.log(selectedFile);
      editAvatar(selectedFile)
    }
  }
  
  return (
    <form onSubmit={onSubmit} className={styles.imageUpload}>
      
        <input
          // className={styles.fileInput_hidden}
          accept="image/jpg, image/jpeg"
          type="file"
          onChange={onSelectFile}
          required
        />
        <br />
      <button className='mainButton' style={{margin: '10px auto', display: 'block'}}>Submit</button>
    </form>
  )
}
