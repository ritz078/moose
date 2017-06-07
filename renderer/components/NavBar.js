/* eslint-disable react/prefer-stateless-function */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Ink from 'react-ink';
import styled, { css } from 'styled-components';
import isRenderer from 'is-electron-renderer';
import Router from 'next/router';
import NotificationBadge, { Effect } from 'react-notification-badge';
import Link from 'next/link';
import { isEmpty } from 'lodash';
import { readConfig } from 'snape-config';
import Cast from './Cast';
import colors from '../constants/colors';

const Wrapper = styled.div`
  height: 40px;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  flex-direction: row-reverse;
  padding:0 10px;
`;

const Icon = styled.i`
  font-size: 20px;
  padding: 8px 14px 6px 14px;
  display: inline-block;
  color: #777;
  cursor: pointer;
  position: relative;
  &:hover{
    color: #555;
  }
  
  ${props =>
    props.active &&
    css`
    color: ${colors.primary}
  `}
`;

export default class MenuBar extends PureComponent {
  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    downloads: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    readConfig((err, { download }) => {
      if (!err && !isEmpty(download)) {
        this.props.dispatch({
          type: 'SET_DOWNLOADS',
          payload: download,
        });
      }
    });
  }

  isCurrentRoute = path => isRenderer && path === Router.pathname;

  render() {
    const badgeContainerStyle = {
      position: 'absolute',
      top: 3,
      right: 1,
    };

    const badgeStyle = {
      backgroundColor: colors.primary,
    };

    return (
      <Wrapper>
        <Cast />
        <Link href="/download" prefetch>
          <Icon className="mdi mdi-download" active={this.isCurrentRoute('/download')}>
            <NotificationBadge
              count={this.props.downloads.length}
              containerStyle={badgeContainerStyle}
              style={badgeStyle}
              effect={Effect.ROTATE_Y}
            />
            <Ink />
          </Icon>
        </Link>
        <Link href="/" prefetch>
          <Icon className="mdi mdi-home" active={this.isCurrentRoute('/')}><Ink /></Icon>
        </Link>
      </Wrapper>
    );
  }
}
