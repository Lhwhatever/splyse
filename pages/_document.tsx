import { ServerStyleSheets } from '@material-ui/core';
import NextDocument, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';
import theme from 'theme';

export default class Document extends NextDocument {
    render(): JSX.Element {
        return (
            <Html lang="en">
                <Head>
                    <meta name="theme-color" content={theme.palette.primary.main} />
                    <style
                        dangerouslySetInnerHTML={{
                            __html: `@font-face{font-family:Circular;src:url(https://sp-bootstrap.global.ssl.fastly.net/8.0.0/fonts/circular-bold.woff2) format('woff2'),url(https://sp-bootstrap.global.ssl.fastly.net/8.0.0/fonts/circular-bold.woff) format('woff');font-weight:700;font-style:normal}`,
                        }}
                    />
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

Document.getInitialProps = async (ctx) => {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
        });

    const initialProps = await NextDocument.getInitialProps(ctx);

    return {
        ...initialProps,
        // Styles fragment is rendered after the app and page rendering finish.
        styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
    };
};
