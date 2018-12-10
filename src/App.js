import React, { Component } from 'react';
import axios from "axios";
import Header from './components/Header/Header';
import EpisodesList from './components/EpisodesList/EpisodesList';
import Player from './components/Player/Player';
import './App.css';

//ToDo: create global variable for server url


class App extends Component {
  constructor() {
    super();
    this.state = {
      error: false,
    };
    this.getEpisodes();
  }

  /**
   * Get episodes from server and set state accordingly.
   */
  getEpisodes() {
    const self = this;
    axios.get('http://localhost:1337/episodes')
      .then(function (response) {
        self.setState({ episodes: response.data, currentEpisode: response.data[0] });

      })
      .catch(function (error) {
        console.log(error);
        self.setState({ errorMessage: 'currently unavailable', error: true });
      });
  }

  /**
   * Update currentEpisode if user selects different episode
   * ToDo: think about whether I should get the episode from the single episode endpoint instead..
   * @param episodeIndex
   */
  handleEpisodeSelection(episodeIndex) {
    const selectedEpisode = this.state.episodes[episodeIndex];
    this.setState((prevState) => {
      if(prevState.currentEpisode.id !== selectedEpisode.id){
        return { currentEpisode: selectedEpisode } ;
      }
    });
  }

  render() {
    return (
      <div className="App">
        <Header />
        <main className="podcast">
          <h1>Title Podcast</h1>
          <Player episode={this.state.currentEpisode} />
          <EpisodesList
            error={this.state.error}
            errorMessage={this.state.errorMessage}
            episodes={this.state.episodes}
            episodeClick={ (episodeIndex) => this.handleEpisodeSelection(episodeIndex) }
          />
        </main>

      </div>
    );
  }
}

export default App;
