import React, {Component} from 'react';
import axios from 'axios';

class EpisodesList extends Component {
  constructor() {
    super();
    this.state = {
      error: false,
    };
    this.getEpisodes();
  }

  /**
   * Get episodes from server and set state accordingly.
   * ToDo: move to app.js in order to select first episode by default and only fetch episodes once..
   */
  getEpisodes() {
   const self = this;
    axios.get('http://localhost:1337/episodes')
      .then(function (response) {
        console.log(response);
        self.setState({ episodes: response.data });

      })
      .catch(function (error) {
        console.log(error);
        self.setState({ errorMessage: 'currently unavailable', error: true });
      });
  }

  /**
   * Create the episode list items
   * @param episodes
   * @returns {Array}
   */
  createEpisodeList(episodes) {
    const list = [];
    episodes.map(item =>
      list.push(
        <li key={item.id}>
          <button onClick={ () => this.episodeClickHandler(item) }>{ item.name }</button>
        </li>
      )
    );
    return list;
  }

  /**
   * Handle the episode button click.
   * @param episodeData
   */
  episodeClickHandler(episodeData) {
    if(typeof this.props.episodeClick === 'function') {
      console.log('yup', episodeData);
      this.props.episodeClick(episodeData);
    }
  }


  render() {
    return (
      <section className="episodes">
        { this.state.error === false && typeof this.state.episodes !== 'undefined' ?
        <ul>
          { this.createEpisodeList(this.state.episodes) }
        </ul>
          :
          <p>{ this.state.errorMessage }</p>
        }
      </section>
    );
  }

}

export default EpisodesList;