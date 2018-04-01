/* eslint-disable react/no-did-mount-set-state,jsx-a11y/media-has-caption */
import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { remote } from 'electron';
import styled from 'styled-components';
import isRenderer from 'is-electron-renderer';
import { isAudio, isVideo } from '../utils/isPlayable';

let Plyr;
let vlc;
if (isRenderer) {
  // only require plyr on the client side as it takes window as an argument
  Plyr = require('plyr');
  vlc = remote.require('./utils/vlc');
}
const VideoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
  & > video {
    width: 100%;
  }
`;

const Vlc = styled.i`
  font-size: 80px;
  position: absolute;
  z-index: 99;
  background-color: rgb(255, 255, 255);
  width: 117px;
  display: inline-block;
  border-radius: 2px;
  text-align: center;
  color: #ff731f;
  cursor: pointer;
`;

class Media extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
    };
  }

  componentDidMount() {
    this.createPlayer();
    this.setState({
      error: false,
    });

    this.player.on('error', () =>
      this.setState({
        error: true,
      }));
  }

  componentDidUpdate() {
    this.createPlayer();
  }

  componentWillUnmount() {
    this.destroyInstance();
  }

  destroyInstance = () => {
    this.player && this.player.destroy();
  };

  createPlayer() {
    if (!this.player) {
      this.player = new Plyr(findDOMNode(this.mediaRef));

      this.player.play();
    }
  }

  streamOnVlc = () => {
    vlc.kill();
    vlc.playOnVlc(`http://127.0.0.1:${window.location.port}${this.props.src}`, this.props.fileName);
  };

  render() {
    const { src } = this.props;
    const { error } = this.state;
    return (
      <VideoWrapper>
        {isVideo(src) && <video controls preload="auto" src={src} ref={x => (this.mediaRef = x)} />}
        {isAudio(src) && <audio controls preload="auto" src={src} ref={x => (this.mediaRef = x)} />}
        {isVideo(src) && error && <Vlc onClick={this.streamOnVlc} className="mdi mdi-vlc" />}
      </VideoWrapper>
    );
  }
}

Media.propTypes = {
  src: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
};

Media.defaultProps = {
  onInit() {},
  options: {
    fluid: true,
  },
};

export default Media;
