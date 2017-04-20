import React, { PropTypes, PureComponent } from 'react';
import styled from 'styled-components';
import videojs from 'video.js';

const VideoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 1220px) {
    max-width: 100%;
  }
`;

class Video extends PureComponent {
  componentDidMount() {
    this.init();
  }

  componentWillReceiveProps() {
    this.init();
  }

  init = () => {
    videojs(this.videoRef, this.props.options, () => {
      this.props.onInit();
    });
  };

  render() {
    return (
      <VideoWrapper>
        <video
          className="video-js vjs-default-skin"
          controls
          preload="auto"
          src={this.props.src}
          ref={x => (this.videoRef = x)}
          autoPlay
          cast
        />
      </VideoWrapper>
    );
  }
}

Video.propTypes = {
  src: PropTypes.string.isRequired,
  onInit: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  options: PropTypes.object,
};

Video.defaultProps = {
  onInit() {},
  options: {
    fluid: true,
  },
};

export default Video;
