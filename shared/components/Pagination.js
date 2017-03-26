import React, { PureComponent, PropTypes } from 'react';
import styled from 'styled-components';

const PaginationBtn = styled.span`
  display: inline-block;
  padding: 10px;
  border: 1px solid #f1f1f1;
  height: 41px;
  vertical-align: middle;
  border-radius: 1px;
  margin: 0 2px;
  width: 40px;
  text-align: center;
  font-weight: bold;
  ${props => props.focus && 'cursor: pointer;'}
  &:hover {
    ${props => props.focus && 'background-color: #fafafa;'}
  }
  & > i {
    font-weight: bold;
  }
`;

export default class Pagination extends PureComponent {
  static propTypes = {
    onNextClick: PropTypes.func.isRequired,
    onPrevClick: PropTypes.func.isRequired,
    currentPage: PropTypes.number,
  }

  static defaultProps = {
    currentPage: 1,
  }

  render() {
    const { currentPage, onNextClick, onPrevClick } = this.props;
    return (
      <div>
        <PaginationBtn focus onClick={onPrevClick}>
          <i className="mdi mdi-chevron-left" />
        </PaginationBtn>
        <PaginationBtn>{currentPage}</PaginationBtn>
        <PaginationBtn focus onClick={onNextClick}>
          <i className="mdi mdi-chevron-right" />
        </PaginationBtn>
      </div>
    );
  }
}

