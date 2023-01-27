import React from 'react';
import game from '../../confs/game_information';
import styles from './header.module.css';

type Game = typeof game;

const Header = (props: {game: Game}) => {
    return (
        <header className={styles.header}>
        <h1>{game.name} made by  {game.developer}</h1>
        </header>
    );
};

export default Header;