import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import styled from 'styled-components';
import LazyCard from 'react-lazy-card/dist/LazyCard';
import Media from './Media';
import { isVideo, isImage } from '../utils/isPlayable';
import DotLoader from './DotLoader';

const ModalControl = styled.div`
  color: #9c9c9c;
  position: fixed;
  top: 5px;
  right: 5px;
  font-size: 20px;
  z-index: 10;
`;

const ImageLightbox = styled.div`
  display: flex;
  background-size:contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: ${props => `url('${props.source}')`};
  height: 100vh;
  width: 100%;
  align-self: center;
  z-index: 9;
`;

const CloseIcon = styled.i`
  font-size: 40px;
  cursor: pointer;
`;

const LoaderWrapper = styled.div`
  flex: 1;
  align-items: center;
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  justify-content: center;
  display: flex;
  z-index: 0;
`;

export default function MediaModal(props) {
  const { fileIndex, file, showModal, onCloseClick } = props;

  if (!fileIndex || !file) return null;

  const style = {
    overlay: {
      backgroundColor: 'rgba(0,0,0,0.95)',
      zIndex: 99,
    },
    content: {
      background: 'transparent',
      border: 'none',
    },
  };

  const src = `/api/download/${file.slug}`;

  return (
    <Modal style={style} isOpen={showModal} contentLabel={'Modal'}>
      <LoaderWrapper><DotLoader color={'#fff'} /></LoaderWrapper>
      <ModalControl>
        <CloseIcon onClick={onCloseClick} className="mdi mdi-close close-modal" />
      </ModalControl>
      {isVideo(file.name) && <Media src={src} fileName={file.name} />}
      {isImage(file.name) && <LazyCard autoLoad image={src} />}
    </Modal>
  );
}

MediaModal.propTypes = {
  fileIndex: PropTypes.string.isRequired,
  showModal: PropTypes.bool.isRequired,
  file: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  onCloseClick: PropTypes.func.isRequired,
};
