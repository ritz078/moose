import React, { PureComponent } from 'react';
import styled from 'styled-components';
import cn from 'classnames';
import { getPlayer } from '../utils/store/cast';
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
  color: #4c4c4c;
`;

const Control = styled.div`
  display: flex;
`;

const SliderMax = styled.span`
  float: right;
  margin-top: -6px;
`;

const Slider = styled.div`
  flex: 1;
  margin-top: 12px;
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
          this.setState({
            sliderValue: status.currentTime,
            sliderMax: status.media.duration,
            title: status.media.metadata.title
          });
        });
      }
    }, 1000);
  }

  componentDidMount() {
    this.interval = this.startPolling();
    getPlayer().on('status', ({ currentTime }) => {
      this.setState({
        sliderValue: currentTime
      });
    });
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
      clearInterval(this.interval);
      this.setState({
        isPaused: true
      });
    });
  };

  seek = (e) => {
    const time = +e.target.value;
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
          <Slider>
            <input
              className="slider tooltip tooltip-top"
              data-tooltip={(sliderValue / 60).toFixed(2)}
              type="range"
              min="0"
              max={sliderMax}
              value={sliderValue}
              onChange={this.seek}
            />
            <SliderMax>{((sliderMax - sliderValue) / 60).toFixed(2)}</SliderMax>
          </Slider>
        </Control>
      </Wrapper>
    );
  }
}
