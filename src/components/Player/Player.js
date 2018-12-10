import React, {Component} from 'react';

class Player extends Component {
  constructor() {
    super();
    this.state = {
      isPlaying: false,
    };
    this.togglePlay = this.togglePlay.bind(this);
    this.goFiveSecBack = this.goFiveSecBack.bind(this);
    this.goFiveSecForward = this.goFiveSecForward.bind(this);
    this.listenForMarkers = this.listenForMarkers.bind(this);
  }

  /**
   * Call create audio with updated audio file when new episode is selected
   * @param prevProps
   */
  componentDidUpdate(prevProps) {
    if (prevProps.episode !== this.props.episode) {
      this.createAudio(this.props.episode.audio);
    }

  }

  /**
   * Set state with new audio instance and add listeners
   * @param file
   */
  createAudio(file) {
    // garbage collection when switching between episodes
    typeof this.state.audio !== 'undefined' && this.state.audio.pause();

    // Instantiate aduio and set State
    const audio = new Audio(`http://localhost:1337${file}`);
    this.setState( (prevState) => {
      if(prevState.audio !== audio) {
        return { audio, isPlaying: false, };
      }
    });

    // use newMarkersObj to find marker for timeupdate
    const newMarkers = this.createNewMarkersObj();

    // add listeners
    audio.ontimeupdate = () => { this.listenForMarkers(newMarkers) };
    audio.onended = () => {this.setState({ isPlaying: false });};
  }

  /**
   * Map markers to new object with start time as key
   */
  createNewMarkersObj() {
    const newMarkers = {};
    this.props.episode.markers.map((item) => {
      const key = item.start;
      key === 0 && this.setState({currentTime: 0, marker: item});
      newMarkers[key] = item;
    });
    return newMarkers;
  }

  listenForMarkers(newMarkers) {
    console.log('playing yess', this.state.audio.currentTime);
    const currentTime = Math.floor(this.state.audio.currentTime).toString();

    console.log('curentTime', currentTime);
    this.setState((prevState) => {
      if (prevState.time !== currentTime) {
        if(newMarkers[currentTime]) {
          return {
            time: currentTime,
            marker: newMarkers[currentTime],
          };
        }
      }
    });
  }

  createMarker(type) {
    const marker= this.state.marker;
    const markerTypes = {
      'ad': <a href={marker.link}>{marker.content}</a>,
      'text': <p>{marker.content}</p>,
      'image': <img src={`http://localhost:1337${marker.content}`} />,
    }
    return markerTypes[type];
  }

  togglePlay() {
    this.state.isPlaying ? this.state.audio.pause() : this.state.audio.play() ;
    this.setState({
      isPlaying: !this.state.isPlaying,
    });
  }

  goFiveSecBack() {
    const audio = this.state.audio;
    audio.currentTime -= 5;
  }

  goFiveSecForward() {
    const audio = this.state.audio;
    audio.currentTime += 5;
  }

  render() {
    console.log('player rerendering', this.props.episode);
    return (
      <section className="player">
        <h1>Title Podcast</h1>
        {typeof this.props.episode !== 'undefined' &&
        <section className="player-episode">
          <h2>{this.props.episode.name}</h2>
          {this.state.marker &&
          <div className="player-episode-marker">
            { this.state.isPlaying && this.createMarker(this.state.marker.type)}

          </div>
          }
          <div className="player-episode-audio">
            <button
              className="button-backward" onClick={this.goFiveSecBack}>&laquo; 5</button>
            <button
              className={`button-toggle-playing button-toggle-playing${this.state.isPlaying ? '--pause' : '--play' }`}
              onClick={this.togglePlay}
            >{this.state.isPlaying ? 'pause' : 'play'}</button>
            <button className="button-forward" onClick={this.goFiveSecForward}>5 &raquo;</button>
          </div>
        </section>
        }
      </section>
    )
  }
}

export default Player;