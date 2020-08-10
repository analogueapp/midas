/*global chrome*/

import React, { useEffect, useState } from 'react';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import * as Sentry from '@sentry/browser';

import { Form, Input, Button, message, notification } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';

import './LoginForm.scss'

interface Props {
  form: any
}

const FormItem = Form.Item;

const LoginForm = () => {

  const [incorrect, setIncorrect] = useState(false)

  useEffect(() => {
    chrome.runtime.onMessage.addListener(messageListener)

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener)
    }
  }, [])

  const messageListener = (request, sender, sendResponse) => {
    if (request.message === "incorrect_password") {
      setIncorrect(true)
    }
  }

  const submitForm = values => {
    chrome.runtime.sendMessage({
      message: "auth_user",
      user: { ...values }
    })
  }

  return (
    <>
      <Form
        wrapperCol={{ span: 14 }}
        name="login"
        initialValues={{ remember: true }}
        onFinish={submitForm}
      >
        <FormItem
          name="email"
          rules={[{ required: true, message: 'Please enter your email'}]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Email"
          />
        </FormItem>
        <FormItem
          name="password"
          rules={[
            { required: true, message: 'Please enter your password'},
            { validator(rule, value) {
              if (incorrect) {return Promise.reject('Username and password do not match');}
              else {return Promise.resolve();}
            }}
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
          />
        </FormItem>
        <FormItem>
          <Button htmlType="submit" block>
            Log in
          </Button>
        </FormItem>
        <p className="formFooter">New to Analogue? <a target="_blank" href="https://analogue.app/signup">Sign up</a></p>
      </Form>
    </>
  )
}

export default LoginForm;
