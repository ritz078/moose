import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Cast from './Cast';

const Wrapper = styled.div`
  height: 40px;
  border-bottom: 1px solid #f5f5f5;
  -webkit-app-region: drag;
  display: flex;
  flex-direction: row-reverse;
  padding:0 10px;
`;

const Icon = styled.i`
  font-size: 20px;
  padding: 8px 10px;
  vertical-align: middle;
  display: inline-block;
  color: #777;
  cursor: pointer;
  &:hover{
    color: #555;
  }
`;

const Li = styled.li`
  cursor: pointer;
  &:hover {
    color: purple;
  }
`;

export default class MenuBar extends PureComponent {
  render() {
    return (
      <Wrapper>
        <div className="popover popover-bottom">
          <Icon className="mdi mdi-menu" />
          <div className="popover-container">
            <ul className="menu">
              <Li className="menu-item">
                <Link href="/">
                  <div><i className="mdi mdi-home fs-18" /> Home</div>
                </Link>
              </Li>
            </ul>
          </div>
        </div>
        <Cast />
        <Link href="/download" prefetch>
          <Icon className="mdi mdi-download" />
        </Link>
        <Link href="/" prefetch>
          <Icon className="mdi mdi-home" />
        </Link>
      </Wrapper>
    );
  }
}
