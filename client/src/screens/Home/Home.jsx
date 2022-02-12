import React from "react";
import { Helmet } from "react-helmet";

//Styles
import "./style.scss";

const Home = () => {

  return (
    <>
      <Helmet>
        <title>تمريني</title> 
      </Helmet>
      <div className="main-container"></div>
    </>
  );
};

export default Home;
