import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import withRedux from 'next-redux-wrapper';
import castUtil, { getPlayer } from '../utils/cast';
import initStore from '../store';

const Icon = styled.i`
  font-size: 20px;
  padding: 8px 10px;
  vertical-align: middle;
  display: inline-block;
  color: #777;
  cursor: pointer;
  &:hover {
    color: #555;
  }
`;

const Li = styled.li`
  cursor: pointer;
  &:hover {
    color: purple;
  }
`;

@withRedux(initStore, ({ cast }) => ({ cast }))
export default class Cast extends PureComponent {
  static propTypes = {
    cast: PropTypes.shape({
      players: PropTypes.array,
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { casts } = castUtil;

    if (casts) {
      this.props.dispatch({
        type: 'SET_PLAYERS',
        payload: casts.players,
      });

      casts.on('update', (player) => {
        casts.players.push(player);
        this.props.dispatch({
          type: 'ADD_PLAYER',
          payload: player,
        });
      });
    }
  }

  selectPlayer = (player) => {
    castUtil.connect(player, () =>
      this.props.dispatch({
        type: 'SET_SELECTED_PLAYER',
        payload: player,
      }));
  };

  disconnect = () => {
    castUtil.destroy(() => {
      this.props.dispatch({
        type: 'REMOVE_SELECTED_PLAYER',
      });
      this.props.dispatch({
        type: 'REMOVE_STREAMING_FILE',
      });
    });
  };

  render() {
    const { cast } = this.props;

    const iconClass = cn('mdi', {
      'mdi-cast': !cast.selectedPlayer,
      'mdi-cast-connected primary': cast.selectedPlayer,
    });
    const { players } = cast;

    return (
      players &&
      !isEmpty(players) && (
        <div className="popover popover-bottom">
          <Icon className={iconClass} />
          <div className="popover-container">
            <ul className="menu">
              {players.map(player => (
                <Li
                  className="menu-item"
                  key={player.name}
                  onClick={() => (getPlayer() ? this.disconnect() : this.selectPlayer(player))}
                >
                  {player.name}
                </Li>
              ))}
            </ul>
          </div>
        </div>
      )
    );
  }
}
