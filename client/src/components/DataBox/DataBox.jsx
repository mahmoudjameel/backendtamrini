import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, A11y } from "swiper";
import GoogleMapReact from "google-map-react";

//Style
import "./style.scss";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import "swiper/components/scrollbar/scrollbar.scss";

//Assets
// @ts-ignore
import LocationMark from "../../assets/img/location-mark.svg";
import MapSearchBox from "../MapSearchBox/MapSearchBox";

SwiperCore.use([Pagination, A11y]);

const DataBox = ({ options, inputs, visible, setVisible }) => {
  const dataBoxRef = useRef(null);
  const inputFileRef = useRef(null);

  const [dataUrls, setDataUrls] = useState([]);

  useEffect(() => {
    if (options.images) bufferToImage({ images: options.images });

    // window.addEventListener("mouseup", containerHandler);
  }, []);

  const containerHandler = (e) => {
    e.preventDefault();

    if (dataBoxRef.current && !dataBoxRef.current.contains(e.target)) {
      setVisible(false);
      setDataUrls([]);
    }
  };

  const bufferToImage = async ({ images = [] }) => {
    if (images.length != 0) {
      for (let i = 0; i < images.length; i++) {
        let blob = await fetch(images[i]).then((r) => r.blob());
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
          setDataUrls([...dataUrls, reader.result]);
          inputFileRef.current &&
            inputFileRef.current.files.append(reader.result);
        };
      }
    }

    if (inputFileRef.current)
      for (let i = 0; i < inputFileRef.current.files.length; i++) {
        let reader = new FileReader();
        reader.readAsDataURL(inputFileRef.current.files[i]);
        reader.onload = () => {
          setDataUrls([...dataUrls, reader.result]);
        };
      }
  };

  const [map, setMap] = useState(false)
  const [maps, setMaps] = useState(null)
  const [isApiReady, setIsApiReady] = useState(null)

  const apiIsLoaded = (map, maps) => {
    if(map && maps) {
      setMap(map);
      setMaps(maps);
      setIsApiReady(true);
    }
  }

  return (
    visible && (
      <div className="float-box-container">
        <div className="data-box" ref={dataBoxRef}>
          <div className="closing" onClick={() => setVisible(false)}>
            <span></span>
            <span></span>
          </div>
          <form
            method="POST"
            onSubmit={(e) => e.preventDefault()}
            ref={options.formRef}
          >
            {options.title && <h3>{options.title}</h3>}
            <div className="input-items">
              {inputs.length !== 0 &&
                inputs.map((input, i) =>
                  input.tag === "input" ? (
                    <React.Fragment key={"frag-" + i}>
                      <div className="input-item">
                        {input.label && <label>{input.label}</label>}
                        <input
                          {...input.props}
                          ref={input.props.type == "file" ? inputFileRef : null}
                          onChange={
                            input.props.type == "file"
                              ? bufferToImage
                              : input.props.onChange
                          }
                        />
                      </div>
                      {input.props.type == "file" && dataUrls.length != 0 && (
                        <div className="input-item">
                          <Swiper
                            spaceBetween={0}
                            slidesPerView={1}
                            pagination={{ clickable: true }}
                          >
                            {dataUrls.map((url, i) => (
                              <SwiperSlide key={"swipe-" + i}>
                                <img className="slider-img" key={i} src={url} />
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        </div>
                      )}
                    </React.Fragment>
                  ) : input.tag === "select" ? (
                    <div className="select-item" key={"select-" + i}>
                      {input.label && <label>{input.label}</label>}
                      <select
                        {...input.props}
                        style={{ width: input.label ? "250px" : "100%" }}
                      >
                        {input.options.map((option) => (
                          <option key={"option-" + i} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <span></span>
                    </div>
                  ) : input.tag === "textarea" ? (
                    <div
                      className="input-item"
                      style={{ alignItems: "flex-start" }}
                      key={"textarea-" + i}
                    >
                      {input.label && <label>{input.label}</label>}

                      <textarea
                        {...input.props}
                        style={{ height: 250, minWidth: "auto" }}
                      ></textarea>
                    </div>
                  ) : input.tag == "location" ? (
                    <div className="map-box" key={"location-" + i}>
                      {
                        isApiReady && (
                          <MapSearchBox
                            placeholder="Search"
                            googlemaps={maps}
                            map={map}
                            isApiReady={isApiReady}
                            onPlacesChanged={(lat, lng) => {
                              map.setCenter()
                              input.setLocation({ lng, lat });
                            }}
                          />
                        )
                      }
                      <GoogleMapReact
                        // options={map => ({ mapTypeId: map.MapTypeId.SATELLITE })}
                        bootstrapURLKeys={{
                          key: "AIzaSyA6pHHk3EgQKrcr0iVwrfmAxVrqwPPnc2Y",
                          libraries: ['places'].join(','),
                        }}
                        yesIWantToUseGoogleMapApiInternals
                        onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps)}
                        center={{
                          lat: input.lat,
                          lng: input.lng,
                        }}
                        defaultZoom={16}
                        onClick={(data) => {
                          input.setLocation({ lng: data.lng, lat: data.lat });
                        }}
                      >
                        <img
                          src={LocationMark}
                          lat={input.lat}
                          lng={input.lng}
                          className="mark-img"
                        />
                      </GoogleMapReact>
                    </div>
                  ) : (
                    <React.Fragment key={"frag-" + i}></React.Fragment>
                  )
                )}
              <div className="input-item">
                <button
                  className="save-btn"
                  type="submit"
                  onClick={options.onSave}
                >
                  {options.btnSave || "حفظ"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  );
};
export default DataBox;
