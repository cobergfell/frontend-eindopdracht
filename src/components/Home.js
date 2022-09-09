import React, { useState, useEffect } from "react";
import background from "../assets/The_Fiddler_Marc_Chagall.png"
//"https://en.wikipedia.org/wiki/File:Image-Chagall_Fiddler.jpg"
import UserService from "../services/user.access.service-DEPRECATED";
//import "./Home.css";
import "../components.styling/home-styling-grid.css";


const Home = () => {
    const [messageValue, setMessageValue] = React.useState('');
    const [checkedTerms, toggleCheckedTerms] = React.useState(false);

  return (
    <div className="home-container-grid">



        <div id="our-vision" className="our-vision">
            {/*<p>Our vision</p>*/}
            {/*<p>This website is is an invitation to combine visual art and classical music, following</p>*/}
            {/*<p>an idea championed by one of the creative minds from which emerged abstract painting,</p>*/}
            {/*<p>as narrated by British music composer Gerad Mc Burney in <a href="https://www.theguardian.com/artanddesign/2006/jun/24/art.art">Wassily Kandinsky: the painter of sound and vision</a> </p>*/}
            <div className="our-vision-title"><strong>Our vision</strong></div>
            This website is an invitation to experiment with combining visual art and music, following
            an idea championed by Vassily Kandinsky, one of the first abstract painters at the begin of the twentieth century.
            A good introduction to the fascination of Kandinsky for music is to be found in an article of British music composer Gerad Mc Burney
            in <a href="https://www.theguardian.com/artanddesign/2006/jun/24/art.art">Vassily Kandinsky: the painter of sound and vision</a>.
            <br/>

        </div>



        <div id="about-us" className="about-us">
            <div className=">About us-title"><strong>About us</strong></div>
            We are a collective of visual artists and musicians investigating the synergy of these two approaches to art.
            We share the same passion for music, visual arts and cultural history.
            The project has been instigated in 2021 at the Art School of s'Hertogenbosh and involves now several Art Schools and conservatoria in the Netherlands and in Flanders
            (disclaimer: this is fantasy, just for the purpose of the Demo of the website)
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

        <div id="what-is-it-all-about" className="what-is-it-all-about">
            <div className=">what-is-it-all-about-title"><strong>What is it all about</strong></div>
            Did you ever wonder if atonality in music could be related one way or the other with abstract painting? If you are curious about the question, this website is for you.
            Here we, explore the parallels and synergy between visual art and music.
            We do this in first instance from an art historical perspective. Trying to draw evolutionary parallels such as atonality and abstraction in painting.
            But it is also interesting to discuss some famous cases, such as rachmaninov inspired by Arnold Böcklin . Or Beethoven’s Pastoral
            which inspired Viennese Jugendstil artist and Gustav Klimt colleague Josef Maria Auchentaller (1865-1949).
            <b/>Is there a relation to be found between Vassily Kandinsky and Alexander Scriabin? Why not,
            as both had rather pretentious attitudes regarding the spiritual significance of their work, with theosophy as a common inspiration source…
            <b/>But this site is also simply the place to be if you thing that your art work will trigger the creativity of contemporary music composers, so please, do not hesitate and take part at the blogs!
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
