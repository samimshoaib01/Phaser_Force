import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { scenes } from './config/scenes';

interface User{
  fullname:string,
  _id:string
}

const PhaserGame: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [user,setUser]=useState<User|null>(null);
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const userId = queryParams.get('userId');
    const userName = queryParams.get('userName');

    console.log('User ID:', userId);
    console.log('User Name:', userName);

    setUser({ fullname: userName||"" , _id: userId||"" });

  }, []);

  useEffect(() => {
    // Only initialize the game once when the component mounts
    if (!gameRef.current && gameContainerRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: window.innerWidth,
          height: window.innerHeight,
        },
        scene: scenes ,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 0 },
            debug: false,
          },
        },
        render: {
          antialias: false, // Disable anti-aliasing
          pixelArt: true    // Enable pixel art mode
        },
        parent: gameContainerRef.current, // Attach Phaser game to the div
      };

      gameRef.current = new Phaser.Game(config);
    }

    // Cleanup function to destroy the game instance when the component unmounts
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return <div id="phaser-game" ref={gameContainerRef} />;
};

export default PhaserGame;
