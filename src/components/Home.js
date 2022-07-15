import React, { useState, useEffect } from "react";
import background from "../assets/The_Fiddler_Marc_Chagall.png"
//"https://en.wikipedia.org/wiki/File:Image-Chagall_Fiddler.jpg"
import UserService from "../services/user.access.service";
//import "./Home.css";
import "../components.styling/home-styling-grid.css";


const Home = () => {
    const [messageValue, setMessageValue] = React.useState('');
    const [checkedTerms, toggleCheckedTerms] = React.useState(false);

  return (
    <div className="home-container-grid">

        <div id="about-us" className="about-us">
            <div className=">About us-title"><strong>About us</strong></div>
            We are a collective of artists and musicians trying to encourage the association of visual arts with classical music.
        </div>


        <div id="welcome" className="welcome">
              <strong>Welcome to Painting Music</strong>
        </div>

        <div id="painting" className="painting">
            <div className="gallery" style={{
                backgroundImage: `url(${background})`
            }}>

            </div>
        </div>


        <div id="our-vision" className="our-vision">
            {/*<p>Our vision</p>*/}
            {/*<p>This website is is an invitation to combine visual art and classical music, following</p>*/}
            {/*<p>an idea championed by one of the creative minds from which emerged abstract painting,</p>*/}
            {/*<p>as narrated by British music composer Gerad Mc Burney in <a href="https://www.theguardian.com/artanddesign/2006/jun/24/art.art">Wassily Kandinsky: the painter of sound and vision</a> </p>*/}
            <div className="our-vision-title"><strong>Our vision</strong></div>
            This website is is an invitation to combine visual art and classical music, following
            an idea championed by one of the creative minds from which emerged abstract painting,
            as narrated by British music composer Gerad Mc Burney in <a href="https://www.theguardian.com/artanddesign/2006/jun/24/art.art">Wassily Kandinsky: the painter of sound and vision</a>

        </div>

    </div>
  );
};

export default Home;


/*const Home = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getPublicContent().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);

  return (
    <div className="container-home">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
    </div>
  );
};

export default Home;*/
