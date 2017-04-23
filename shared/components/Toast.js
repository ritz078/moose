import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import cn from 'classnames';
import { toast } from 'react-toastify';

export default function Toast(props) {
  const mainClass = cn('toast', {
    'toast-primary': props.type === 'default',
    'toast-success': props.type === 'success',
    'toast-danger': props.type === 'warning',
    'toast-error': props.type === 'error'
  });

  return (
    <div className={mainClass}>
      {props.text}
    </div>
  );
}

Toast.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['default', 'success', 'warning', 'error'])
};

Toast.defaultProps = {
  type: 'default'
};

const Close = styled.button`
  margin-top: 12px !important;
  margin-right: 10px !important;
  cursor: pointer;
  color: #fff !important;
  opacity: 1 !important;
`;

export function showToast(text, type) {
  toast(<Toast text={text} type={type} />, {
    closeButton: ({ closeToast }) => (
      <Close className="btn btn-clear float-right" onClick={closeToast} />
    )
  });
}
