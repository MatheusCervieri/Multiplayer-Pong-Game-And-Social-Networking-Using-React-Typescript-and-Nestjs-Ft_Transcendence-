import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BtnContainer = styled.div`
    display: flex;
`;

const Title = styled.h3`
  font-size: 24px;
  color: orange;
  margin-bottom: 20px;
`;

const StyledButton = styled.button`
  background-color: blue;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  width: 150px;
  min-width: 100px;
  max-width: 100px;
  margin: 10px;
`;


const StyledButton2 = styled.button<{selected: string}> `
  background-color: ${props => (props.selected === 'Rooms') ? 'blue' : 'white'};
  color: ${props => (props.selected === 'Rooms') ? 'white' : 'blue'};
  padding: 10px 20px;
  border-radius: 5px;
  border: 1px solid blue;
  font-size: 16px;
  cursor: pointer;
  min-width: 100px;
  max-width: 100px;
`;

const StyledButton3 = styled.button<{selected: string}> `
  background-color: ${props => (props.selected === 'Direct Message') ? 'blue' : 'white'};
  color: ${props => (props.selected === 'Direct Message') ? 'white' : 'blue'};
  padding: 10px 20px;
  border-radius: 5px;
  border: 1px solid blue;
  font-size: 16px;
  cursor: pointer;
  min-width: 100px;
  max-width: 100px;
`;

export { Container, BtnContainer, StyledButton2, Title, StyledButton , StyledButton3};