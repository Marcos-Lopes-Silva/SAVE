import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel='preload' src='/assets/modern.min.css' as='style' />
        <link rel='stylesheet' src='/assets/modern.min.css' />
        <link rel='preload' src='/assets/defaultV2.min.css' as='style' />
        <link rel='stylesheet' src='/assets/defaultV2.min.css' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}