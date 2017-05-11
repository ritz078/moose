import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import isRenderer from 'is-electron-renderer';
import { isAudio, isVideo } from '../utils/logic/isPlayable';

let plyr;
if (isRenderer) {
  // only require plyr on the client side as it takes window as an argument
  plyr = require('plyr');
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

class Media extends PureComponent {
  componentDidMount() {
    this.player = plyr.setup(this.mediaRef);
    this.player[0].play(); // since autoPlay in video tag is buggy in this browser.
  }

  componentDidUpdate() {
    this.player[0].play(); // since autoPlay in video tag is buggy in this browser.
  }

  componentWillUnmount() {
    this.player[0].destroy();
  }

  render() {
    return (
      <VideoWrapper>
        {isVideo(this.props.src) &&
          <video controls preload="auto" src={this.props.src} ref={x => (this.mediaRef = x)} />}
        {isAudio(this.props.src) &&
          <audio controls preload="auto" src={this.props.src} ref={x => (this.mediaRef = x)} />}
      </VideoWrapper>
    );
  }
}

Media.propTypes = {
  src: PropTypes.string.isRequired
};

Media.defaultProps = {
  onInit() {},
  options: {
    fluid: true
  }
};

export default Media;
