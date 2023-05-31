import React from 'react'


import styles from './Top.module.scss';
import logo from '../../assets/Logo.svg';
import { useScrollToAnchor } from '../../utils/useScrollToAnchor.hook';

function Navbar({user}) {
  
  const scrollToAnchor = useScrollToAnchor()
  return (
    <div id="top" className={styles.nav}>
      <div className={styles.nav__container}>
          <div className={styles.nav__logo}>
          </div>
          <div className={styles.nav__navigation}>
            {/* <button className={'mainButton'} onClick={() => scrollToAnchor('comments')}>Comments</button> */}
            <button className={'mainButton'} onClick={() => {scrollToAnchor(user ? 'profile' : 'login')}}>{user ? 'Profile' : 'Login'}</button>
          </div>
      </div>
    </div>
  )
}

export default Navbar