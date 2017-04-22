import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

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

export default function MenuBar() {
  return (
    <Wrapper>
      <div className="popover popover-bottom">
        <Icon className="mdi mdi-menu" />
        <div className="popover-container">
          <ul className="menu">
            <li className="menu-item">
              <Link href="#">
                <div><i className="mdi mdi-home fs-18" /> Home</div>
              </Link>
            </li>
            <li className="divider" />
            <li className="menu-item">
              <Link href="#">
                <div><i className="mdi mdi-download fs-18" /> Downloads</div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </Wrapper>
  );
}
