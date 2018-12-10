import React, {Component} from 'react'

class ScrubBar extends Component {
  constructor() {
    super();
    this.state = {
      sliderValue: 0,
    };
    this.updateScrubBar = this.updateScrubBar.bind(this);
  }
  componentDidUpdate(prevProps) {

    this.props.audio.addEventListener('timeupdate', this.updateScrubBar);
    if(prevProps.audio !== this.props.audio) {
      prevProps.audio.removeEventListener('timeupdate', this.updateScrubBar);
    }
  }
  updateScrubBar() {
    const percentage = Math.round(100 * this.props.audio.currentTime / this.props.audio.duration);
    this.setState({
      sliderValue: percentage,
    });
  }

  jumpToTime(event) {
    const audio = this.props.audio;
    audio.currentTime = Math.round(event.target.value * Math.round(audio.duration) / 100);
  }


  render() {
    return (
      <div className="scrub-bar">
        <input
          className="scrub-bar-slider"
          type="range" min="0"
          max="100"
          value={this.props.hasEnded ? 0 : this.state.sliderValue}
          onChange = { (e) => this.jumpToTime(e) }
          // onMouseUp={ (e) => this.jumpToTime(e)}
        />
      </div>
    )
  }
}
export default ScrubBar