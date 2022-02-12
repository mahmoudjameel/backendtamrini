import { useState, useEffect } from "react";
import axios from "axios";
import { useNotifierContext } from "../../providers";

//Styles
import "./style.scss";
import { Helmet } from "react-helmet";

const Stats = () => {
  const { setNotifiers } = useNotifierContext();

  const [stats, setStats] = useState({
    halls: 0,
    articles: 0,
    imageExercises: 0,
    videoExercises: 0,
    products: 0,
    orders: 0,
    users: 0,
    proteins: 0,
    diets:0
  });

  useEffect(() => {
    (async () => {
      await getStats();
    })();
  }, []);

  const getStats = async () => {
    try {
      let response = await axios.post("/api/stats/all");
      let data = await response.data;

      if (!data.status) {
        setNotifiers({ errors: data.errors });
      }

      setStats({ ...stats, ...data.stats });
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <>
      <Helmet>
        <title>لوحة التحكم / الإحصائيات</title>
      </Helmet>
      {/* <Header /> */}
      <div className="main-container">
        <div className="page-position">
          <h2>لوحة التحكم</h2>
          <p>/</p>
          <h6>الإحصائيات</h6>
        </div>

        <div className="stats">
          <div className="head">
            <h3>الإحصائيات</h3>
          </div>
          <div className="boxs">
            <div className="stats-box">
              <div className="item">
                <div className="num">{stats.users}</div>
                <div className="title">المستخدمين</div>
              </div>
            </div>
            <div className="stats-box">
              <div className="item">
                <div className="num">{stats.articles}</div>
                <div className="title">المقالات</div>
              </div>
            </div>
            <div className="stats-box">
              <div className="item">
                <div className="num">{stats.diets}</div>
                <div className="title">اكلات دايت</div>
              </div>
            </div>

            <div className="stats-box">
              <div className="item">
                <div className="num">{stats.barcodes}</div>
                <div className="title"> البحث عن طريق الباركود</div>
              </div>
            </div>

            <div className="stats-box">
              <div className="item">
                <div className="num">{stats.videoExercises}</div>
                <div className="title">التمارين الجاهزة (فيديو)</div>
              </div>
            </div>
            <div className="stats-box">
              <div className="item">
                <div className="num">{stats.imageExercises}</div>
                <div className="title">التمارين الرياضية (صور)</div>
              </div>
            </div>
            <div className="stats-box">
              <div className="item">
                <div className="num">{stats.proteins}</div>
                <div className="title">المكملات الغذائية</div>
              </div>
            </div>
            <div className="stats-box">
              <div className="item">
                <div className="num">{stats.halls}</div>
                <div className="title">الصالات الرياضية</div>
              </div>
            </div>
            <div className="stats-box">
              <div className="item">
                <div className="num">{stats.orders}</div>
                <div className="title">الطلبات</div>
              </div>
            </div>
            <div className="stats-box">
              <div className="item">
                <div className="num">{stats.products}</div>
                <div className="title">المنتجات</div>
              </div>
            </div>
          </div>
          {/* <span className="line"></span> */}
        </div>
      </div>
    </>
  );
};

export default Stats;
