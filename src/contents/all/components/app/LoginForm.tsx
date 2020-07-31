/*global chrome*/

import React, { useEffect, useState } from 'react';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import * as Sentry from '@sentry/browser';

import { Form, Icon, Input, Button, message, notification } from 'antd';
import { Form, Input, Button, message, notification } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';

import './LoginForm.scss'

interface Props {
  form: any
}

const FormItem = Form.Item;

const LoginForm = ({form}: Props) => {

  const submitForm = ev => {
    ev.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        chrome.runtime.sendMessage({
          message: "auth_user",
          user: {
            email: values.email,
            password: values.password
          }
        })
      }
    })
  }

  const { getFieldDecorator } = form;

  return (
    <>
      <div className="loginForm">
        <Form onSubmit={submitForm}>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Not a valid email' }
              ],
              validateTrigger: "onBlur"
            })(
              <Input
                size="large"
                prefix={<Icon type="mail" />}
                placeholder="Email"
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: 'Please enter your password' }
              ],
              validateTrigger: "onBlur"
            })(
              <Input.Password
                size="large"
                prefix={<Icon type="lock" />}
                placeholder="Password"
              />
            )}
          </FormItem>
          <FormItem>
            <Button htmlType="submit">
              Log in
            </Button>
          </FormItem>
        </Form>
      </div>
      <p className="formFooter formLink"><Link to="/password/reset" className="">Forgot your password?</Link></p>
      <p className="formFooter">New to Analogue? <Link to="/signup">Sign Up</Link></p>
    </>
  )
}

export default Form.create<Props>()(LoginForm);
