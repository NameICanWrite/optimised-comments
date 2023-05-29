import React from 'react'


import styles from './Top.module.scss';
import { useScrollToAnchor } from '../../utils/useScrollToAnchor.hook';
import bannerImage from '../../assets/tyned_pexels-alexandr-podvalny.jpeg'

export default function Banner({isSignupSuccess}) {
  const scrollToAnchor = useScrollToAnchor()

  return (
    <div className={styles.banner}>
      <div className={styles.banner_bg}>
        <img src={bannerImage} /> 
      </div>
      <h1 className={styles.banner__title}>
        Test assignment for front-end developer
      </h1>
      <p className={styles.banner__paragraph}>
        What defines a good front-end developer is one that has skilled
        knowledge of HTML, CSS, JS with a vast understanding of User
        design thinking as they'll be building web interfaces with
        accessibility in mind. They should also be excited to learn, as
        the world of Front-End Development keeps evolving.
      </p>
      {!isSignupSuccess && <button className={'mainButton'} onClick={() => scrollToAnchor('signup')}>Sign up</button>}
    </div>
  )
}
