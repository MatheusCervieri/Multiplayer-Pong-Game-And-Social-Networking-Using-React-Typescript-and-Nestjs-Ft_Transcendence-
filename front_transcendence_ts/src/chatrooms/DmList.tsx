import React from 'react'
import { Room } from './ChatInterface';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface DmListProps {
    dms: Room[];
    username: string;
}

const DmListS = styled.ul`
  max-height: 200px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  margin-left: -35px;
  
  ::-webkit-scrollbar {
    width: 8px;
    background-color: #F5F5F5;
  }
  
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #A9A9A9;
  }
`;

const DmS = styled.li`
  list-style: none;
  margin-bottom: 10px;
`;

const StyledLink = styled(Link)`
  color: blue;
  text-decoration: none;
  font-size: 16px;
  &:hover {
    color: lightblue;
  }
`;

export default function DmList(props: DmListProps) {
    function removeSubstring(str: string, substring: string): string {
        return str.replace(substring, '');
      }
      return (
        <DmListS>
          {props.dms.map((dm: any) => (
            <DmS key={dm.id}>
              <StyledLink to={`/chat/${dm.id}`}>
                {removeSubstring(dm.name, props.username)}
              </StyledLink>
            </DmS>
          ))}
        </DmListS>
      )
}
