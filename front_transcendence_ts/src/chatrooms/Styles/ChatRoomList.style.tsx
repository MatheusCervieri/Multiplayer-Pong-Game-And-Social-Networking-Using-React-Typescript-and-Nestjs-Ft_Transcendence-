import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BtnContainer = styled.div`
    display: flex;
`;


const StyledButton = styled.button`
  background-color: #007bff;
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
  background-color: ${props => (props.selected === 'Rooms') ? '#007bff' : 'white'};
  color: ${props => (props.selected === 'Rooms') ? 'white' : '#007bff'};
  padding: 10px 20px;
  border-radius: 5px;
  border: 1px solid #007bff;
  font-size: 16px;
  cursor: pointer;
  min-width: 100px;
  max-width: 100px;
`;

const StyledButton3 = styled.button<{selected: string}> `
  background-color: ${props => (props.selected === 'Direct Message') ? '#007bff' : 'white'};
  color: ${props => (props.selected === 'Direct Message') ? 'white' : '#007bff'};
  padding: 10px 20px;
  border-radius: 5px;
  border: 1px solid #007bff;
  font-size: 16px;
  cursor: pointer;
  min-width: 100px;
  max-width: 100px;
`;

export { Container, BtnContainer, StyledButton2, StyledButton , StyledButton3};