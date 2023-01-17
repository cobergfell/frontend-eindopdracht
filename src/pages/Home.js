import React, { useState, useEffect } from "react";
import background from "../assets/Kandinsky_Composition_VIII_1923_v2.png"
import "../pages.styling/home-styling-grid.css";


const Home = () => {

  return (
    <main className="home-container-grid"
         style={{
             backgroundImage: `url(${background})`,
             backgroundSize: 'cover'
         }}

    >
        <article id="our-vision" className="our-vision">
            <div className="our-vision-title"><strong>Our vision</strong></div>
            This website is about combining visual art and 'classic' music, following
            an idea championed by Vassily Kandinsky, one of the first abstract painters at the begin of the twentieth century.
            A good introduction to the fascination of Kandinsky for music is to be found in an article of British music composer Gerad Mc Burney
            in <a href="https://www.theguardian.com/artanddesign/2006/jun/24/art.art">Vassily Kandinsky: the painter of sound and vision</a>.
            <br/>

        </article>



        <article id="about-us" className="about-us">
            <div className=">About us-title"><strong>About us</strong></div>
            We are a collective of visual artists and musicians investigating the synergy of these two approaches to art.
            We share the same passion for music, visual arts and cultural history.
            The project has been instigated in 2021 at the Art School of s'Hertogenbosh and involves now several Art Schools and conservatoria in the Netherlands and in Flanders
            (disclaimer: this is fantasy, just for the purpose of the Demo of the website)
        </article>



        <div id="welcome" className="welcome">
              <strong>Welcome to Painting Music</strong>
        </div>



        <article id="what-is-it-all-about" className="what-is-it-all-about">
            <div className=">what-is-it-all-about-title"><strong>What is it all about</strong></div>
            Did you ever wonder if atonality in music could be related one way or the other with abstract painting? If you are curious about the question, this website is for you.
            Here we explore the parallels and synergy between visual art and music.
            We do this in first instance from an art historical perspective. Trying to draw evolutionary parallels such as atonality and abstraction in painting.
            But it is also interesting to discuss some famous cases, such as Serguei Rachmaninov inspired by Arnold Böcklin . Or Beethoven’s Pastoral
            which inspired Viennese Jugendstil artist and Gustav Klimt's friend Josef Maria Auchentaller (1865-1949).
            <b/>Is there a relation to be found between Vassily Kandinsky and Alexander Scriabin ?
            <b/>But this site is also simply the place to be if you think that your art work will trigger the creativity of contemporary music composers, so please, do not hesitate and take part at the blogs!
        </article>

    </main>
  );
};

export default Home;