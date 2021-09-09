import 'antd/dist/antd.css'

import React, { FunctionComponent } from 'react'
import { AppProps } from 'next/app'
import { Layout } from 'antd'

const MyApp: FunctionComponent<AppProps> = ({ Component: Page, pageProps }) => {
  const { Header, Content, Footer } = Layout
  return (
    <>
      <Layout>
        <Header>header</Header>
        <Content>
          <Page {...pageProps} />
        </Content>
        <Footer>footer</Footer>
      </Layout>
      <style jsx>
        {`
          main,
          header,
          footer {
            padding: 1.5rem;
          }

          header {
            color: #ffffff;
            line-height: unset;
            height: auto;
          }

          main {
            background: #ffffff;
          }

          footer {
            font-size: 0.825rem;
          }
        `}
      </style>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Glory&display=swap');

        html,
        body {
          margin: 0;
          padding: 0;
          font-size: 16px;
          font-family: Glory, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell,
            Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </>
  )
}

export default MyApp
