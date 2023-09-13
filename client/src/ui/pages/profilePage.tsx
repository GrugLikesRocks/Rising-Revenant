import React from 'react';
import { OutpostList } from '../components/profileList';
import { PhaserLayer } from '../../phaser';
import "../styles/ProfilePageStyle.css";

export const ProfilePage: React.FC<{ layer: PhaserLayer }> = ({ layer }) => {
  
  return   <div className = "profile-page-container">
    <OutpostList layer={layer} />
    </div>;
};


