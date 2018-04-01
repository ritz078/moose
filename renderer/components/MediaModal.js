import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import styled from 'styled-components';
import { findIndex } from 'lodash';
import LazyCard from 'react-lazy-card/dist/LazyCard';
import Swipe from 'react-photostory/dist/Swipe';
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

const ImageName = styled.span`
  display: block;
  text-align: center;
  margin-top: 94vh;
  color: #eee;
`;

export default function MediaModal(props) {
  const {
    fileIndex, file, showModal, onCloseClick, imageFiles,
  } = props;

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

  const initialIndex = findIndex(imageFiles, o => o.slug === file.slug);

  const src = `/api/download/${file.slug}`;
  let mediaCompRef;

  const mediaComponent = isVideo(file.name) && (
    <Media src={src} ref={x => (mediaCompRef = x)} fileName={file.name} />
  );

  return (
    <Modal style={style} isOpen={showModal} contentLabel="Modal" ariaHideApp={false}>
      <LoaderWrapper>
        <DotLoader color="#fff" />
      </LoaderWrapper>
      <ModalControl>
        <CloseIcon
          onClick={() => {
            if (mediaCompRef) {
              mediaCompRef.destroyInstance();
            }
            onCloseClick();
          }}
          className="mdi mdi-close close-modal"
        />
      </ModalControl>
      {mediaComponent}
      {isImage(file.name) && (
        <Swipe
          initialIndex={initialIndex}
          height="100vh"
          responsive
          prev={<i className="mdi mdi-chevron-left" />}
          next={<i className="mdi mdi-chevron-right" />}
        >
          {imageFiles.map(image => (
            <LazyCard image={`/api/download/${image.slug}`} key={image.slug}>
              <ImageName>{image.name}</ImageName>
            </LazyCard>
          ))}
        </Swipe>
      )}
    </Modal>
  );
}

MediaModal.propTypes = {
  fileIndex: PropTypes.string.isRequired,
  imageFiles: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string,
  })),
  showModal: PropTypes.bool.isRequired,
  file: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    slug: PropTypes.string,
  }).isRequired,
  onCloseClick: PropTypes.func.isRequired,
};

MediaModal.defaultProps = {
  imageFiles: [],
};
