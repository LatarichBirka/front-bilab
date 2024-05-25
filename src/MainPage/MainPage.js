import React from 'react';
import NavigationBar from "../сomponents/NavigationBar/NavigationBar.js";
import Content from "../сomponents/Content/Content.js";
import Footer from "../сomponents/Footer/Footer.js";
import Hollow from '../сomponents/NavigationBar/Hollow.js';
import './MainPage.css'

function MainPage(props) {
  return (
    <div>
      <NavigationBar />
      <Hollow />
      <div className="MainPage">
        <div className="hero-section">
          <img src="https://beautymastera.ru/wp-content/uploads/2024/02/novosti-kosmetologii.jpg" alt="Cosmetology Clinic" className="hero-image" />
          <div className="hero-text">
            <h1>Добро пожаловать в B.I.Lab - Центр Косметологии</h1>
            <p>Мы предлагаем лучшие косметологические процедуры для вас.</p>
          </div>
        </div>
        <Content>
          <div className="clinic-info-grid">
            <div className="clinic-image">
              <img src="https://skinerica-clinic.ru/assets/cache_image/assets/content/images/services/banner/DEN_2714_430x486_7a2.jpg" alt="Clinic" className="rounded-image"/>
              <p>Современные технологии в «B.I.Lab»</p>
              <p>EMSCULPT NEO - передовая технология в области эстетической медицины, разработанная компанией BTL Aesthetics. Технология сочетает в себе два мощных метода: радиочастотный липолиз и высокоинтенсивную стимуляцию.</p>
            </div>
            <div className="clinic-details">
              <div className="clinic-detail">
                <h3>Оборудование премиум-класса</h3>
                <p>Мы используем оборудование «премиум» класса всемирно известных фирм – производителей.</p>
              </div>
              <div className="clinic-detail">
                <h3>Все по правилам</h3>
                <p>Мы прошли десятки мастер-классов и провели сотни тысяч процедур. В результате - сформировали строгие требования и стандарты качества медицинских услуг в наших центрах, чтобы гарантировать эффективность работы с каждым пациентом.</p>
              </div>
              <div className="clinic-detail">
                <h3>Услуги all inclusive</h3>
                <p>В нашем центре вы найдете все, чтобы выглядеть и чувствовать себя прекрасно! Мы оказываем полный спектр косметологических и дерматологических услуг лица и тела, а также заботимся о здоровье наших пациентов.</p>
              </div>
              <div className="clinic-detail">
                <h3>Отношения на высоком уровне</h3>
                <p>Мы понимаем, как важно приветливое и внимательное отношение к каждому клиенту, а еще знаем, что постоянство - признак мастерства. Поэтому поддерживаем мастерство не только в услугах, но и в сервисе, причем на едином уровне во всех городах, где работаем.</p>
              </div>
            </div>
          </div>
        </Content>
      </div>
      <Footer />
    </div>
  );
}

export default MainPage;
