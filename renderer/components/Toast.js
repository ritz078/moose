import React from 'react';
import PropTypes from 'prop-types';
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

export function showToast(text, type) {
  toast(<Toast text={text} type={type} />);
}
