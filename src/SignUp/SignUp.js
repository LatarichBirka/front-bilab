import React, { useEffect, useState } from "react";
import { Form, Input, Radio, Button, DatePicker, notification } from "antd";
import { DingtalkOutlined } from "@ant-design/icons";
import { signup } from "../Api/Authentication";
import "./SignUp.css";
import {
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import moment from 'moment';
import NavigationBar from "../сomponents/NavigationBar/NavigationBar.js";
import Hollow from "../сomponents/NavigationBar/Hollow.js";
import Footer from "../сomponents/Footer/Footer.js";

function SignUp(props) {
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (localStorage.getItem("accessToken") !== null) {
  //     props.history.push("/");
  //   }
  // }, []);

  const onFinish = (values) => {
    const dateOfBirth = values.dateOfBirth.format('YYYY-MM-DD');
    const dataToSend = { ...values, dateOfBirth,
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6", avatarPath: ""
     };

    console.log(dataToSend)
    setLoading(true);
    fetch(' https://localhost:7235/api/Auth/register', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    })
    .then(response => {
      console.log(response)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      notification.success({
        message: "Success",
        description:
          "Вы успешно зарегистироваровалсь, пожалуйста, авторизируйтесь для продолжения! ",
      });
      props.history.push("/sign-in");
      setLoading(false);
    })
    .catch(error => {
      notification.error({
        message: "Error",
        description:
          error.message || "Пожалуйста, попробуйте снова!",
      });
      setLoading(false);
    });
  //   signup(dataToSend)
  //     .then((response) => {
  //       notification.success({
  //         message: "Success",
  //         description:
  //           "Вы успешно зарегистироваровалсь, пожалуйста, авторизируйтесь для продолжения! ",
  //       });
  //       props.history.push("/sign-in");
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       notification.error({
  //         message: "Error",
  //         description:
  //           error.message || "Пожалуйста, попробуйте снова!",
  //       });
  //       setLoading(false);
  //     });
  };


  return (
    <div className="login-page">
      <NavigationBar />
      <Hollow />
    <div className="signup-container">
      <div className="signup-form-wrapper">
        <h1>Регистрация</h1>
        <Form
          name="normal_login"
          className="signup-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="firstName"
            rules={[{ required: true, message: "Пожалуйста, напишите своё имя!" }]}
          >
            <Input size="large" placeholder="Имя" />
          </Form.Item>
          <Form.Item
            name="lastName"
            rules={[{ required: true, message: "Пожалуйста, напишите свою фамилию!" }]}
          >
            <Input size="large" placeholder="Фамилия" />
          </Form.Item>
          <Form.Item
            name="patronymic"
            rules={[{ required: true, message: "Пожалуйста, напишите своё отчество!" }]}
          >
            <Input size="large" placeholder="Отчество" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Пожалуйста, напишите свой email!" }]}
          >
            <Input size="large" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Пожалуйста, напишите свой пароль!" }]}
          >
            <Input size="large" prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Пароль" />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            rules={[{ required: true, message: "Пожалуйста, напишите свой номер телефона!" }]}
          >
            <Input size="large" placeholder="Номер телефона" />
          </Form.Item>
          <Form.Item
            name="sex"
            rules={[{ required: true, message: "Пожалуйста, укажите свой пол!" }]}
          >
            <Radio.Group>
              <Radio value={0}>Мужской</Radio>
              <Radio value={1}>Женский</Radio>
              <Radio value={2}>Не выбрано</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="dateOfBirth"
            label="Дата рождения"
            rules={[{ required: true, message: "Пожалуйста, укажите свою дату рождения!" }]}
          >
            <DatePicker
              size="large"
              style={{ width: "100%" }}
              placeholder="Выберите дату"
              format="YYYY-MM-DD"
              defaultValue={moment()}
            />
          </Form.Item>
          <Form.Item>
            <Button
              shape="round"
              size="large"
              htmlType="submit"
              className="signup-form-button"
              loading={loading}
            >
              Регистрация
            </Button>
          </Form.Item>
          Уже зарегистрированы? <a href="/sign-in">Авторизация</a>
        </Form>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default SignUp;
