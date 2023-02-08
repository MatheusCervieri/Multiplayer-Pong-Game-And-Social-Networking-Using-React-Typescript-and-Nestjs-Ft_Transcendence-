import React from 'react'
import { Room } from './ChatInterface';
import { Link } from 'react-router-dom';

interface DmListProps {
    dms: Room[];
    username: string;
}

export default function DmList(props: DmListProps) {
    function removeSubstring(str: string, substring: string): string {
        return str.replace(substring, '');
      }
    return (
        <ul>
        {props.dms.map((dm: any) => (
          <>
          <Link key={dm.id} to={`/chat/${dm.id}`}>
          {removeSubstring(dm.name, props.username)}
          <br></br>
          </Link>
         </>
        ))}
      </ul>
      )
}
