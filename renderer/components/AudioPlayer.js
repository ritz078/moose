import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import initStore from '../store';
import Media from './Media';
import { Wrapper, Title } from './Controls';
import { isAudio } from '../utils/logic/isPlayable';

@withRedux(initStore, ({ selectedTorrent }) => ({ selectedTorrent }))
export default class AudioPlayer extends PureComponent {
  static propTypes = {
    selectedTorrent: PropTypes.shape({
      slug: PropTypes.string,
      name: PropTypes.string
    })
  };

  static defaultProps = {
    selectedTorrent: {}
  };

  render() {
    const { selectedTorrent } = this.props;
    const src = `/api/download/${selectedTorrent.slug}`;
    return (
      (selectedTorrent &&
        selectedTorrent.name &&
        isAudio(selectedTorrent.name) &&
        <Wrapper>
          <Title>{selectedTorrent.name}</Title>
          <Media src={src} />
        </Wrapper>) ||
        <div />
    );
  }
}
