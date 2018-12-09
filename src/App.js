import React, { Component } from 'react';
import EpisodesList from './components/EpisodesList/EpisodesList';
import Player from './components/Player/Player';
import './App.css';

class App extends Component {

  handleEpisodeSelection(episodeData) {
    console.log('epsiode in app.js', episodeData);
  }
  render() {
    return (
      <div className="App">
        <main className="podcast">
          <Player />
          <EpisodesList episodeClick={ (episodeData) => this.handleEpisodeSelection(episodeData) } />
        </main>

      </div>
    );
  }
}

export default App;
