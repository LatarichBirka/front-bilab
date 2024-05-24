import React from 'react'
import './About.css'
import aboutlogo from './aboutlogo.jpeg';
import NavigationBar from "../сomponents/NavigationBar/NavigationBar.js";
import Hollow from "../сomponents/NavigationBar/Hollow.js";
import Footer from "../сomponents/Footer/Footer.js";

const About = () => {
  return (
    <div>
      <NavigationBar />
      <Hollow />
      <div className="about-container">
        <div className="about-header">
          <img src={aboutlogo} alt="Клиника" className="about-image" />
          <div className="about-header-text">
            <h1>О клинике</h1>
            <p>
              Клиника косметологии «B.I.Lab» начала работу одной из первых в Слюдянке. За годы работы клиника завоевала репутацию высокого профессионализма и надежности у пациентов, оказывая услуги в косметологии по высоким стандартам, подтвержденным медицинской лицензией.
            </p>
          </div>
        </div>
        <div className="about-details">
          <div className="about-detail">
            <h2>Лучшие специалисты</h2>
            <p>
              Высококвалифицированные врачи косметологи, эксперты антивозрастной медицины, за плечами которых многолетний опыт и стони процедур.
            </p>
          </div>
          <div className="about-detail">
            <h2>Диагностика и лечение</h2>
            <p>
              Помимо проведения косметологических процедур, мы оказываем диагностическую помощь женщинам в вопросах дермотологии, а также при осложнениях после процедур.
            </p>
          </div>
          <div className="about-detail">
            <h2>Современное оборудование</h2>
            <p>
              Клиника оснащена современным оборудованием, а перечень процедур постоянно расширяется и может удовлетворить самых взыскательных пациентов.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
