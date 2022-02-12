import React from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

export default class MapSearchBox extends React.Component {

  static propTypes = {
    placeholder: PropTypes.string,
    onPlacesChanged: PropTypes.func
  }

  render() {
    return <input className="mapBox-search-input" ref="input" placeholder={this.props.placeholder} type="text"/>;
  }
  onPlacesChanged = () => {
    if (this.props.onPlacesChanged) {
      const lat = this.searchBox.getPlaces()[0].geometry.location.lat();
      const lng = this.searchBox.getPlaces()[0].geometry.location.lng();
      this.props.onPlacesChanged(lat, lng);
    }
  }
  componentDidMount() {
    var input = ReactDOM.findDOMNode(this.refs.input);
    // eslint-disable-next-line no-undef
    this.searchBox = new this.props.googlemaps.places.SearchBox(input);
    this.searchBox && this.searchBox.addListener('places_changed', this.onPlacesChanged);
  }
}