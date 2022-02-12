import { useState } from "react";
import GoogleMapReact from "google-map-react";

//Style
import "./style.scss";

//Assets
// @ts-ignore
import LocationMark from "../../assets/img/location-mark.svg";

const MapBox = ({
  visible,
  setVisible = (visible) => null,
  lat = 33.363666,
  lng = 44.404379,
}) => {
  return (
    visible && (
      <div className="float-box-container">
        <div className="map-box-container">
          <div className="closing" onClick={() => setVisible(false)}>
            <span></span>
            <span></span>
          </div>
          <GoogleMapReact
            // options={map => ({ mapTypeId: map.MapTypeId.SATELLITE })}
            bootstrapURLKeys={{
              key: "AIzaSyA6pHHk3EgQKrcr0iVwrfmAxVrqwPPnc2Y",
            }}
            defaultCenter={{
              lat,
              lng,
            }}
            defaultZoom={16}
          >
            <img src={LocationMark} lat={lat} lng={lng} className="mark-img" />
          </GoogleMapReact>
        </div>
      </div>
    )
  );
};

export default MapBox;
