import styled from 'styled-components';

export const FixedWidthDiv = styled.div`
  width: ${props => props.width};
  text-align: ${props => props.align};
`;

FixedWidthDiv.defaultProps = {
  align: 'center',
};

export const FixedWidthTd = FixedWidthDiv.withComponent('td');
