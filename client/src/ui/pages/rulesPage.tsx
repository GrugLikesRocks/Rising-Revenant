import React from 'react';
import "../styles/RulesPageStyle.css";

export const RulesReactComp: React.FC = () => {
    return (
      <div className='rules-page-container'>
        <div className='rules-page-title'> This should be a title</div>
        <div className='rules-page-text-container'>
          <p className='rules-paragraph'>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
          <p className='rules-paragraph'>Doloremque asperiores consequuntur ipsum?</p>
          <p className='rules-paragraph'>Explicabo totam deleniti maiores?</p>
         
        </div>
      </div>
    );
  };
  
