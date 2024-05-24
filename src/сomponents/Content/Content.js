import React from 'react';
import './Content.css';

const Content = ({ children }) => {
  return (
    <div className="content-main">
      {children}
    </div>
  );
};

export default Content;
