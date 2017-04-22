import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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
  render() {
    return (
      <VideoWrapper>
        <video
          controls
          preload="auto"
          src={this.props.src}
          ref={x => (this.videoRef = x)}
          autoPlay
        />
      </VideoWrapper>
    );
  }
}

Video.propTypes = {
  src: PropTypes.string.isRequired,
  onInit: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  options: PropTypes.object
};

Video.defaultProps = {
  onInit() {},
  options: {
    fluid: true
  }
};

export default Video;
