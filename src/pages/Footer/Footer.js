import React from "react";
import "./footer.css";

const Footer = () => {
    return (
        <footer className="footer-wrapper">
            <h2 className="footer-title">
                <strong>Painting Music: explore the  common grounds of painting evolution and music evolution</strong>
            </h2>

            <section className="footer-column-container-1">
                <ul className="footer-column-items">

                    <li >
                        <a href={`/home/#our-history`}  className="footer-link">Our vision</a>
                    </li>
                    <li >
                        <a href={`/home/#about-us`} className="footer-link">About us</a>
                    </li>
                    <li >
                        <a href={`/home/#what-is-it-all-about`} className="footer-link">What is it all about</a>

                    </li>

                </ul>
            </section>
            <address className="footer-column-container-2">
                <ul className="footer-column-items">
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
                </ul>

            </address>

            <address className="footer-column-container-3">
                <ul className="footer-column-items">
                    <li >
                        Contact us
                    </li>
                    <li >
                        Phone: +31-(0)6-51793406
                    </li>
                    <li >
                        <a href="mailto:Christophe.Obergfell@novi-education.nl" className="footer-link">Email Us: Christophe.Obergfell@novi-education.nl</a>
                    </li>
                </ul>

            </address>

        </footer>
    );
};
export default Footer;
