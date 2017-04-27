import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import isRenderer from 'is-electron-renderer';

let plyr;
if (isRenderer) {
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

class Video extends PureComponent {
  componentDidMount() {
    this.player = plyr.setup(this.videoRef);
    this.player[0].play(); // since autoPlay in video tag is buggy in this browser.
  }

  componentWillUnmount() {
    this.player[0].destroy();
  }

  render() {
    return (
      <VideoWrapper>
        <video controls preload="auto" src={this.props.src} ref={x => (this.videoRef = x)} />
      </VideoWrapper>
    );
  }
}

Video.propTypes = {
  src: PropTypes.string.isRequired
};

Video.defaultProps = {
  onInit() {},
  options: {
    fluid: true
  }
};

export default Video;
