import React, { PureComponent, PropTypes } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

const HeaderWrapper = styled.header`
  width: 100%;
  padding: 10px 5%;
  position: fixed;
  box-shadow: 0 1px 1px rgba(0,0,0,0.15);
  z-index: 99;
  background-color: white;
`;

const SearchInput = styled.input`
  height: 4.2rem;
  padding: 0 20px;
  font-family: inherit;
  background-color: #f7f7f7;
  border: 1px solid #f3f3f3;
`;

const SearchButton = styled.button`
  height: 4.2rem;
  padding: 0 20px;
  font-family: inherit;
`;

@connect()
export default class Header extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    dispatch() {
    },
  }

  handleSearch = (e: (KeyboardEvent | MouseEvent)) => {
    if (e.type === 'keypress' && e.which !== 13) return;

    const input: string = this.inputRef.value;

    this.setState({
      searchTerm: input,
    });

    this.props.dispatch({
      type: 'SET_PAGE',
      payload: 1,
    });

    if (input.match(/magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32}/i) != null) {
      this.props.dispatch({
        type: 'FETCH_DETAILS',
        payload: input,
      });
    } else {
      this.props.dispatch({
        type: 'FETCH_RESULTS',
        payload: input,
      });
    }
  }

  render() {
    return (
      <HeaderWrapper className="row">
        <div className="input-group">
          <SearchInput
            type="text"
            className="form-input"
            placeholder="Search or paste your magnet url"
            innerRef={x => (this.inputRef = x)}
            onKeyPress={this.handleSearch}
          />
          <SearchButton
            className="btn btn-primary input-group-btn"
            onClick={this.handleSearch}
          >
            Submit
          </SearchButton>
        </div>
      </HeaderWrapper>
    );
  }
}
