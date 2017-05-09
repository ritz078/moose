import React, { PureComponent } from 'react';
import Slider from 'rc-slider';
import styled from 'styled-components';
import cn from 'classnames';
import { getPlayer } from '../utils/cast';
import { showToast } from './Toast';

const Wrapper = styled.div`
  height: 90px;
  background-color: white;
  border-top: 1px solid #eee;
  display: flex;
  padding:0 10px;
  flex-direction: column;
  box-shadow: 0 0px 5px 0px rgba(0,0,0,0.1);
`;

const Icon = styled.i`
  font-size: 28px;
  width: 40px;
  padding: 5px;
  cursor: pointer;
  color: #676767;
  &:hover{
    color: #000;
  }
`;

const Title = styled.h6`
  font-size: 14px;
  margin: 12px 10px 3px;
  color: #5764c6;
  font-weight: 500;
`;

const Control = styled.div`
  display: flex;
`;

const SliderMax = styled.span`
  float: right;
  margin-top: -4px;
`;

const SliderWrapper = styled.div`
  flex: 1;
  margin-top: 17px;
`;

export default class Controls extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sliderValue: 0,
      sliderMax: 0,
      title: 'Playing',
      isPaused: false
    };
  }

  startPolling() {
    return setInterval(() => {
      const player = getPlayer();

      if (player) {
        player.status((err, status) => {
          if (status.playerState === 'PLAYING') {
            this.setState({
              sliderValue: status.currentTime,
              sliderMax: status.media.duration,
              title: status.media.metadata.title
            });
          }
        });
      }
    }, 1000);
  }

  stopPolling = () => {
    clearInterval(this.interval);
  };

  componentDidMount() {
    setTimeout(() => {
      this.interval = this.startPolling();
    }, 1000);
  }

  pause = () => {
    getPlayer().pause((err) => {
      if (err) {
        showToast(err.message, 'error');
        return;
      }
      clearInterval(this.interval);
      this.setState({
        isPaused: true
      });
    });
  };

  handleToggle = () => (this.state.isPaused ? this.play() : this.pause());

  play = () => {
    getPlayer().play(null, null, (err) => {
      if (err) {
        showToast(err.message, 'error');
      }
    });
    this.setState({
      isPaused: false
    });
  };

  stop = () => {
    getPlayer().stop((err) => {
      if (err) {
        showToast(err.message, 'err');
        return;
      }
      this.stopPolling();
      this.setState({
        isPaused: true
      });
    });
  };

  seek = (time) => {
    getPlayer().seek(time, (err) => {
      if (err) {
        showToast(err.message, 'err');
        return;
      }
      this.setState({
        sliderValue: time
      });
    });
  };

  componentWillUnmount() {
    this.stopPolling();
  }

  render() {
    const { isPaused, sliderMax, sliderValue, title } = this.state;

    const playClass = cn('mdi', {
      'mdi-play': isPaused,
      'mdi-pause': !isPaused
    });
    return (
      <Wrapper>
        <Title>{title}</Title>
        <Control>
          <Icon className={playClass} onClick={this.handleToggle} />
          <Icon className="mdi mdi-stop" onClick={this.stop} />

          <SliderWrapper>
            <Slider min={0} max={sliderMax} value={sliderValue} onAfterChange={this.seek} />
            <SliderMax>{((sliderMax - sliderValue) / 60).toFixed(2)}</SliderMax>
          </SliderWrapper>

        </Control>
      </Wrapper>
    );
  }
}
