import React from "react";
import "../components.styling/footer-styling-grid.css";

const Footer = () => {
    return (
        <div className="footer-wrapper">
            <div className="footer-title">
                <strong>Painting Music: learn painting the forms and colors of music</strong>
            </div>

            <div className="footer-column-container-1">
                {/*<div className="about-us"  >
                    <a href="#about-us">About us</a>
                </div>*/}
                <div className="footer-column-items">

                    <li >
                        <a href="#our-history"  className="footer-link">Our vision</a>
                    </li>
                    <li >
                        <a href="#about-us" className="footer-link">About us</a>
                    </li>
                    <li >
                        <a href="#what-is-it-all-about" className="footer-link">What is it all about</a>
                    </li>

                </div>
            </div>
            <div className="footer-column-container-2">
                <div className="footer-column-items">
                    <li >
                        Visit us
                    </li>
                    <li >
                        Painting Music hosted by Bozar (just faking)
                    </li>
                    <li >
                        Rue Ravensteinstraat 23
                    </li>

                    <li >
                         1000 Brussel, België
                    </li>
                </div>

            </div>

            <div className="footer-column-container-3">
                <div className="footer-column-items">
                    <li >
                        Contact us
                    </li>
                    <li >
                        Phone: +31-(0)6-51793406
                    </li>
                    <li >
                        <a href="mailto:Christophe.Obergfell@novi-education.nl" className="footer-link">Email Us: Christophe.Obergfell@novi-education.nl</a>
                    </li>
                </div>

            </div>

        </div>
    );
};
export default Footer;
