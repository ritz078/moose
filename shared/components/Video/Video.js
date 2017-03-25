import React, { PropTypes } from 'react';
import * as videojs from 'Video.js';

class Video extends React.Component {
  componentDidMount() {
    videojs(this.videoRef, this.props.options, () => {
      this.props.onInit();
    });
  }

  render() {
    return (
      <div style={{ display: 'flex', height: '100%' }}>
        <div className="video-wrapper">
          <video
            className="video-js vjs-default-skin"
            controls
            preload="auto"
            src={this.props.src}
            ref={x => (this.videoRef = x)}
            autoPlay
          />
        </div>
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
