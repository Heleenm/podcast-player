import React, {Component} from 'react';
import './epsiodelist.css'

class EpisodesList extends Component {

  /**
   * Create the episode list items
   * @param episodes
   * @returns {Array}
   */
  createEpisodeList(episodes) {
    const list = [];
    episodes.map((item, index) =>
      list.push(
        <li key={item.id}>
          <button onClick={ () => this.episodeClickHandler(index) }>{ item.name }</button>
        </li>
      )
    );
    return list;
  }

  /**
   * Handle episode button click
   * @param episodeIndex
   */
  episodeClickHandler(episodeIndex) {
    if(typeof this.props.episodeClick === 'function') {
      this.props.episodeClick(episodeIndex);
    }
  }


  render() {
    return (
      <section className="section-wrapper episodes">
        <h2>Episodes:</h2>
        { this.props.error === false && typeof this.props.episodes !== 'undefined' ?
        <ul>
          { this.createEpisodeList(this.props.episodes) }
        </ul>
          :
          <p>{ this.props.errorMessage }</p>
        }
      </section>
    );
  }

}

export default EpisodesList;