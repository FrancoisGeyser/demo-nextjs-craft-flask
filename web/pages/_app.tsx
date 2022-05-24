import '@/styles/app.css'
import App from 'next/app'
import React from 'react'
import nookies from 'nookies'
import { UserContext } from '@/context/userContext'
import { theme } from '@/styles/theme'
import { ThemeProvider } from '@material-ui/styles'

export default function MyApp({ Component, pageProps, user }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={{ user: user }}>
        <Component {...pageProps} />
      </UserContext.Provider>
    </ThemeProvider>
  )
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext)
  const { ctx } = appContext
  const { client_id } = nookies.get(ctx)
  let user = { client_id }

  return {
    ...appProps,
    user,
  }
}
