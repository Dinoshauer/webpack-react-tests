'use strict';
import '../../styles/main.scss';
import React from 'react';

class App extends React.Component {
  render () {
    return (
      <div>{this.props.children}</div>
    );
  }
}

export default App;
