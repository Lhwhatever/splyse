import {CssBaseline, ThemeProvider} from '@material-ui/core'
import {AppProps} from 'next/app'
import Head from 'next/head'
import React from 'react'
import theme from 'theme'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
    React.useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side')
        if (jssStyles) jssStyles.parentElement!.removeChild(jssStyles)
    }, [])

    return (
        <React.Fragment>
            <Head>
                <title>Spotlysis</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Component {...pageProps} />
            </ThemeProvider>
        </React.Fragment>
    )
}
