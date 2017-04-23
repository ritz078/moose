import React, { PureComponent } from 'react';
import styled from 'styled-components';
import castUtil from '../utils/store/cast';

const Wrapper = styled.div`
  height: 50px;
  background-color: white;
  border-top: 1px solid #eee;
  display: flex;
  padding:0 10px;
`;

const Icon = styled.i`
  font-size: 28px;
  width: 40px;
  padding: 5px;
`;

export default class Controls extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      sliderValue: 0,
      sliderMax: 0,
      title: ''
    };
  }

  startPolling() {
    setInterval(() => {
      if (castUtil.selectedPlayer) {
        castUtil.selectedPlayer.status((err, status) => {
          console.log(status);
          this.setState({
            sliderValue: status.currentTime,
            sliderMax: status.items[0].media.duration
          });
        });
      }
    }, 1000);
  }

  componentDidMount() {
    this.startPolling();
    castUtil.selectedPlayer.on('status', ({ currentTime }) => {
      console.log(currentTime);
      this.setState({
        sliderValue: currentTime
      });
    });
  }

  handleChange = (e) => {
    this.setState({
      sliderValue: e.target.value
    });
  };

  pause = () => {
    castUtil.selectedPlayer.pause((err) => {
      console.log(err);
    });
  };

  render() {
    return (
      <Wrapper>
        <Icon className="mdi mdi-play" onClick={this.pause} />
        <Icon className="mdi mdi-stop" onClick={castUtil.selectedPlayer.stop} />
        <input
          className="slider"
          type="range"
          min="0"
          max={this.state.sliderMax}
          value={this.state.sliderValue}
          onChange={this.handleChange}
        />
        <Icon className="mdi mdi-format-list-bulleted" />
      </Wrapper>
    );
  }
}
