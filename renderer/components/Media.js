import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { remote } from 'electron';
import styled from 'styled-components';
import isRenderer from 'is-electron-renderer';
import { isAudio, isVideo } from '../utils/logic/isPlayable';

let plyr,
  vlc;
if (isRenderer) {
  // only require plyr on the client side as it takes window as an argument
  plyr = require('plyr');
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
      error: false
    };
  }

  componentDidMount() {
    this.createPlayer();
    this.setState({
      error: false
    });

    this.player[0].on('error', () =>
      this.setState({
        error: true
      })
    );
  }

  componentDidUpdate() {
    this.createPlayer();
  }

  createPlayer() {
    if (!this.player) {
      this.player = plyr.setup(this.mediaRef, {
        autoplay: true
      });
    }
  }

  componentWillUnmount() {
    this.player[0].destroy();
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
  fileName: PropTypes.string.isRequired
};

Media.defaultProps = {
  onInit() {},
  options: {
    fluid: true
  }
};

export default Media;
