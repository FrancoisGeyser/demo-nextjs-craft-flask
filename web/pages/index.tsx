import React from 'react'
import Head from 'next/head'
import styles from './index.module.scss'
import { API } from '@/api/api'

export default function Home() {
    const handleLogout = async(e) => {
        e.preventDefault();
       const data =  await API.auth.logout()
        if (data.logout === true) window.location.href = '/'
    }    
  return (
    <div className={styles.container}>
      <Head>
        <title>Page Builder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>Welcome to Page Builder!</h1>

        <p className={styles.description}>Get started now...</p>

        <div className={styles.grid}>
          <a href="/login" className={styles.card}>
              <h3>Log In &rarr;</h3>
              <p>Log In to see your pages.</p>
            </a>

            <a href='' onClick={handleLogout} className={styles.card}>
            <h3>Log out &rarr;</h3>
            <p>Log out of your session</p>
          </a>

          <a href="/user" className={styles.card}>
              <h3>User Page &rarr;</h3>
              <p>See your page</p>
          </a>

          <a href="/admin" className={styles.card}>
            <h3>Admin Area &rarr;</h3>
            <p>Go to your page builder.</p>
          </a>

        </div>
      </main>

      <footer className={styles.footer}>
        <a href="#" target="_blank" rel="noopener noreferrer">
          Powered by NextJS, CraftJS, Styled-Components, Tailwind and Flask
        </a>
      </footer>
    </div>
  )
}
