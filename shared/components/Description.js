/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ajax } from 'rxjs/observable/dom/ajax';
import classNames from 'classnames';
import withRedux from 'next-redux-wrapper';
import initStore from '../../store';
import MediaModal from './MediaModal';
import getFileType from '../utils/logic/fileType';
import colors from '../constants/colors';

const Wrapper = styled.div`
  width: 100%;
  background-color: white;
  bottom: 0;
  flex:1;
  border-bottom: 1px solid #eee;
  overflow: hidden;
  display: flex;
  justify-content: center;
`;

const TileWrapper = styled.div`
  color: ${props => props.color};
  height: 3rem;
  width: 4rem;
  display: flex;
  align-items: center;
  align-content: space-around;
  font-size: 13px;
`;

const Table = styled.table`
  overflow: scroll;
  flex: 1;
  width: 100%;
`;

const Files = styled.div`
  flex: 0.6;
  padding-top: 10px;
  overflow: scroll;
`;

const Info = styled.div`
  flex: 0.4;
`;

@withRedux(initStore, ({ details, loading }) => ({
  details,
  loading
}))
export default class Description extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
    details: PropTypes.shape({
      name: PropTypes.string,
      torrentId: PropTypes.string,
      files: PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.string,
        size: PropTypes.string
      })
    })
  };

  static defaultProps = {
    dispatch() {},
    details: {},
    fixed: false
  };

  constructor(props) {
    super(props);

    this.state = {
      streaming: false,
      selectedIndex: null
    };
  }

  startStream = (e) => {
    this.setState({
      streaming: true,
      selectedIndex: e.target.dataset.id
    });
  };

  closeModal = () => {
    this.setState({ streaming: false });
    ajax.getJSON(`/api/delete/${this.props.details.torrentId}`);
  };

  listTorrent = ({ torrentId }) => {
    this.props.dispatch({
      type: 'FETCH_DETAILS',
      payload: torrentId
    });
  };

  getFileIcon = (mime) => {
    let icon;

    switch (getFileType(mime)) {
      case 'audio':
        icon = 'mdi-music-note';
        break;
      case 'video':
        icon = 'mdi-movie';
        break;
      case 'application':
        icon = 'mdi-application';
        break;
      case 'zip':
        icon = 'mdi-zip-box';
        break;
      case 'image':
        icon = 'mdi-file-image';
        break;
      default:
        icon = 'mdi-file-document';
    }
    return (
      <TileWrapper color={colors.primary}>
        <i style={{ fontSize: '18px' }} className={`mdi ${icon} centered`} />
      </TileWrapper>
    );
  };

  getFiles() {
    const { details } = this.props;

    const x =
      details &&
      details.files &&
      details.files.map((file, i) => {
        const fileType = getFileType(file.type);
        const streamIcon = classNames('mdi tooltip tooltip-left fs-18', {
          'mdi-play-circle-outline': fileType === 'video',
          'mdi-eye': fileType === 'image'
        });

        return (
          <tr>
            <td>{this.getFileIcon(file.type)}</td>
            <td style={{ maxWidth: '275px' }} className="text-ellipsis">{file.name}</td>
            <td>{file.size}</td>
            <td>
              {Description.isSupported(file.type) &&
                <button className="btn btn-link" onClick={this.startStream}>
                  <i
                    className={streamIcon}
                    data-tooltip={fileType === 'video' ? 'Play Video' : 'View Image'}
                    data-id={i}
                  />
                </button>}
            </td>
          </tr>
        );
      });

    return <Files><Table><tbody>{x}</tbody></Table></Files>;
  }

  static isSupported(mime) {
    return (
      document.createElement('video').canPlayType(mime) ||
      mime === 'video/x-matroska' ||
      getFileType(mime) === 'image'
    );
  }

  render() {
    const { details, loading } = this.props;

    if (!details.name) return <div />;

    if (loading) return <Wrapper><div className="loading" /></Wrapper>;

    return (
      <Wrapper>
        <Info />
        {this.getFiles()}
        <MediaModal
          infoHash={details.torrentId}
          fileIndex={this.state.selectedIndex}
          showModal={this.state.streaming}
          file={details.files[this.state.selectedIndex]}
          onCloseClick={this.closeModal}
        />
      </Wrapper>
    );
  }
}
