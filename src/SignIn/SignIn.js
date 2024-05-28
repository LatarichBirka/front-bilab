import React, { useEffect, useState } from "react";
import { Form, Input, Button, Divider, notification } from "antd";
import {
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import NavigationBar from "../сomponents/NavigationBar/NavigationBar.js";
import Hollow from "../сomponents/NavigationBar/Hollow.js";
import Footer from "../сomponents/Footer/Footer.js";
import "./SignIn.css"

const SignIn = (props) => {
    const [loading, setLoading] = useState(false);
    const [test, setTest] = useState(localStorage.getItem("accessToken"));

    useEffect(() => {
        // if (localStorage.getItem("accessToken") !== null) {
        //   props.history.push("/sign-in");
        // }
        // initFacebookLogin();
      }, []);

    const onFinish = (values) => {
        setLoading(true);
        // Здесь запрос на авторизацию
        // login(values) ?Email=birkinvlad%40gmail.com&Password=password'
        fetch("https://localhost:7235/api/Auth/login?Email=" + values.email + "&Password=" + values.password)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log(data);
            if (data.value.accessToken) {
              // accessToken в локальное хранилище
              localStorage.setItem('accessToken', data.value.accessToken);
              localStorage.setItem('refreshToken', data.value.refreshToken);
              localStorage.setItem('UserID', data.value.data.id);
              notification.success({
                message: "Success",
                description:
                  "Вы успешно авторизировались! ",
              });
              props.history.push("/");
              setLoading(false);
            } else {
              throw new Error('Access Token not found');
            }
            })
          .catch((error) => {
            if (error.status === 401) {
              notification.error({
                message: "Error",
                description: "Почта или пароль неверные! Попробуйте снова!",
              });
            } else {
              notification.error({
                message: "Error",
                description:
                  error.message || "Простите! Что-то пошло не так, попробуйте снова!",
              });
            }
            setLoading(false);
          });
      };


      return (
        <div className="login-page">
          <NavigationBar />
          <Hollow />
          <div className="login-container">
          <div className="login-form-wrapper">
            {/* <h2>Авторизация</h2> */}
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[{ required: true, message: "Пожалуйста, напишите свой email!" }]}
              >
                <Input
                  size="large"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Email"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Пожалуйста, напишите свой пароль!" }]}
              >
                <Input
                  size="large"
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  shape="round"
                  size="large"
                  htmlType="submit"
                  className="login-form-button"
                  loading={loading}
                >
                  Авторизоваться
                </Button>
              </Form.Item>
              <p className="register-link">
                Ещё не зарегистрированы? <a href="/sign-up">Регистрация</a>
              </p>
            </Form>
          </div>
          </div>
          <Footer />
        </div>
    );
};

export default SignIn;

