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
            <br/>Any form of visual art can be combined with any kind of painting, and we are of course already accustomed to pop music combined with video clips. What we would like to encourage is go beyond.
            First we can dive into the still living cultural roots of Western art and find how paintings could have inspired musician and vice versa. For example, Rembrandt versus Jan Pieterszoon Sweelinck in the Dutch Golden Age, Arnold Böcklin and Romantic compositors including Rachmaninov in the ninetieth Century. Beethoven’s Pastoral Symphony was the inspiration for Viennese Jugendstil artist and Klimt colleague Josef Maria Auchentaller (1865-1949) to create paintings based on each of the symphony’s movements. Is there a link to be found between Vassily Kandinsly and Alexander Scriabin, as both had rather pretentious attitudes regarding the spiritual significance of their work (with theosophy as a common inspiration source…)But we could also explore contemporary art and contemporary music, what could be the visual art parallel of the compositions of Karl Heinz Stockhausen?




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
