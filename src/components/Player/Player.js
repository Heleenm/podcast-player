import React, {Component} from 'react'
import ScrubBar from "./scrubBar";
import './player.css';

class Player extends Component {
  constructor() {
    super();
    this.state = {
      isPlaying: false,
      hasEnded: false,
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

    // Instantiate audio and set State
    const audio = new Audio(`http://localhost:1337${file}`);
    this.setState( (prevState) => {
      if(prevState.audio !== audio) {
        return { audio, isPlaying: false, hasEnded: true };
      }
    });

    //create newMarkersObj to find marker for timeupdate
    this.createNewMarkersObj();

    // add listeners
    audio.ontimeupdate = () => { this.listenForMarkers() };
    audio.onended = () => { this.setState({ isPlaying: false, hasEnded: true }); };
  }

  /**
   * Map markers to new object with start time as key
   */
  createNewMarkersObj() {
    const newMarkers = {};
    let defaultMarker= {};
    this.props.episode.markers.map((item) => {
      const key = item.start;
      defaultMarker = key === 0 && {time: 0, marker: item};
      newMarkers[key] = item;
    });
    this.setState({
      time: defaultMarker.time,
      marker: defaultMarker.item,
      newMarkers,
    });
  }


  listenForMarkers() {

    const currentTime = Math.floor(this.state.audio.currentTime).toString();
    this.setState((prevState) => {
      if (prevState.time !== currentTime) {
        if(this.state.newMarkers[currentTime] ) {
          return {
            time: currentTime,
            marker: this.state.newMarkers[currentTime],
          }
        }
      }
    });
  }

  /**
   * Get markup based on type of marker
   * @param type
   */
  getMarker(type) {
    const marker= this.state.marker;
    const markerTypes = {
      'ad': <a className="marker" href={marker.link}>{marker.content}</a>,
      'text': <p className="marker">{marker.content}</p>,
      'image': <img className="marker" src={`http://localhost:1337${marker.content}`} alt="" />,
    };
    return markerTypes[type];
  }


  togglePlay() {
    this.state.isPlaying ? this.state.audio.pause() : this.state.audio.play() ;
    this.setState({
      isPlaying: !this.state.isPlaying,
      hasEnded: false,
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
    return (
      <section className="section-wrapper player">
        {typeof this.props.episode !== 'undefined' &&
        <div className="player-inner-wrapper">
          <h2>{this.props.episode.name}</h2>
          {typeof this.state.marker !== 'undefined' &&
          <section className="player-episode-marker">
            { !this.state.hasEnded && this.getMarker(this.state.marker.type) }
          </section>
          }
          {/* ToDo: move controls to separate component */}
          { this.state.audio &&
          <section className="player-episode-audio-controls">
            <ScrubBar
              audio={this.state.audio}
              isPlaying={this.state.isPlaying}
              hasEnded={this.state.hasEnded}
            />
            <div className="audio-control-buttons">
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
        </div>
        }
      </section>
    )
  }
}

export default Player;