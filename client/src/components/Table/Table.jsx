import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, A11y } from "swiper";
import {url} from "../../config";
//Style
import "./style.scss";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import "swiper/components/scrollbar/scrollbar.scss";

//Assets
//@ts-ignore
import TrashIcon from "../../assets/img/trash.svg";

SwiperCore.use([Pagination, A11y]);

const Table = ({ headers, data, actions }) => {
  return (
    <div className="table-container">
      <div className="table">
        <table>
          <thead>
            <tr>
              {headers && headers.map((head, i) => <th key={i}>{head}</th>)}
              {actions && <th>الإجراء</th>}
            </tr>
          </thead>
          <tbody>
            {data &&
              data.length !== 0 &&
              data.map((inputs, i) => (
                <tr key={i}>
                  {inputs &&
                    inputs.map((input) => (
                      <td>
                        {input && input.type == "img" ? (
                          <img src={input.src} className="main-img" />
                        ) : input && input.type == "slider" ? (
                          <Swiper
                            spaceBetween={0}
                            slidesPerView={1}
                            pagination={{ clickable: true }}
                          >
                            {input.images.map((img) => (
                              <SwiperSlide style={{ width: 160 }}>
                                <img src={img} className="slider-img" />
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        ) : input && input.type == "location" ? (
                          <button
                            className="maps-btn"
                            onClick={input.onClick && input.onClick}
                          >
                            عرض الخريطة
                          </button>
                        ) : input && input.type == "video" ? (
                          <iframe
                            className="video-frame"
                            src={`
                              ${url}/play-youtube?videoId=${input.videoId}`}
                          ></iframe>
                        ) : (
                          input
                        )}
                      </td>
                    ))}
                  {actions && (
                    <td className="action">
                      {actions.edit && (
                        <button
                          onClick={() => actions.edit(inputs[0])}
                          className="btn-edit"
                        >
                        تعديل
                        </button>
                      )}
                      {actions.delete && (
                        <img
                          onClick={() => actions.delete(inputs[0])}
                          src={TrashIcon}
                          alt="حذف"
                          title="حذف"
                        />
                      )}
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="pagination" data-update-function="searchForUsers"></div>
    </div>
  );
};

export default Table;
