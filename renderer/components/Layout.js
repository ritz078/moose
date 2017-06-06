import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import Loading from 'react-loading-bar'
import { ToastContainer } from 'react-toastify'
import styled from 'styled-components'

import NProgress from 'nprogress'
import Router from 'next/router'

import stylesheet from '../styles/index.less'
import MenuBar from './NavBar'
import Controls from './Controls'
import AudioPlayer from './AudioPlayer'
import initLogReceivers from '../utils/logReceiver'

initLogReceivers()

NProgress.configure({ showSpinner: false })

Router.onRouteChangeStart = () => {
  NProgress.start()
}
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

const Container = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
`

const Close = styled.button`
  margin-top: 12px !important;
  margin-right: 10px !important;
  cursor: pointer;
  color: #fff !important;
  opacity: 1 !important;
`

const CloseButton = ({ closeToast }) =>
  <Close className="btn btn-clear float-right" onClick={closeToast} />

CloseButton.propTypes = {
  closeToast: PropTypes.func.isRequired
}

export default function Layout({ children, loading, cast, download, dispatch }) {
  return (
    <Container>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" type="image/png" href="./static/images/favicon.png" />
        <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
      </Head>
      <Loading show={loading} showSpinner={false} color="#3f51b5" />
      <MenuBar downloads={download} dispatch={dispatch} />

      {children}
      {cast.streamingMedia ? <Controls /> : <AudioPlayer />}

      <ToastContainer
        autoClose={3000}
        position="bottom-center"
        closeButton={<CloseButton />}
        hideProgressBar
      />
    </Container>
  )
}

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  loading: PropTypes.bool.isRequired,
  cast: PropTypes.shape({
    streamingMedia: PropTypes.any
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  download: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
}

Layout.defaultProps = {
  children: []
}
