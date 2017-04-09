import React, { PropTypes, PureComponent } from 'react';
import styled from 'styled-components';
import videojs from 'video.js';

const VideoWrapper = styled.div`
  max-width: 95%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
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
  }

  render() {
    return (
      <div style={{ display: 'flex', height: '100%' }}>
        <VideoWrapper>
          <video
            className="video-js vjs-default-skin"
            controls
            preload="auto"
            src={this.props.src}
            ref={x => (this.videoRef = x)}
            autoPlay
          />
        </VideoWrapper>
      </div>
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
  onInit() {
  },
  options: {
    fluid: true,
  },
};

export default Video;
