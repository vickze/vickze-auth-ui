import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import { Checkbox, Alert, Modal, Icon } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';
import GlobalFooter from '@/components/GlobalFooter';
import DocumentTitle from 'react-document-title';
import SelectLang from '@/components/SelectLang';
import logo from '../../assets/logo.svg';
import getPageTitle from '@/utils/getPageTitle';
import PageLoading from '@/components/PageLoading';
import { getPageQuery } from '@/utils/utils';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;


const links = [
  {
    key: 'github',
    title: <Icon type="github" />,
    href: 'https://github.com/vickze',
    blankTarget: true,
  },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2019 vickze
  </Fragment>
);


@connect(({ loading, login, menu: menuModel }) => ({
  login,
  submitting: loading.effects['login/login'],
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
    loading: true,
  };

  componentWillMount() {
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;

    dispatch({
      type: 'login/validate',
      callback: () =>{
        this.setState({
          loading: false,
        })
      }
    })
    // dispatch({
    //   type: 'menu/getMenuData',
    //   payload: { routes: routes || [], authority },
    // });
  }


  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);

          Modal.info({
            title: formatMessage({ id: 'app.login.verification-code-warning' }),
          });
        }
      });
    });

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const {
      login,
      submitting,
      location: { pathname },
      breadcrumbNameMap,
    } = this.props;
    const { type, autoLogin, loading } = this.state;

    console.log(breadcrumbNameMap);
    const loginContent = <div className={styles.main}>
      <Login
        defaultActiveKey={type}
        onTabChange={this.onTabChange}
        onSubmit={this.handleSubmit}
        ref={form => {
          this.loginForm = form;
        }}
      >
        <Tab key="account" tab={formatMessage({ id: 'app.login.tab-login-credentials' })}>
          {login.status === 'error' &&
            login.type === 'account' &&
            !submitting &&
            this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
          <UserName
            name="username"
            // placeholder={`${formatMessage({ id: 'app.login.userName' })}: admin or user`}
            placeholder={`${formatMessage({ id: 'app.login.userName' })}`}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'validation.userName.required' }),
              },
            ]}
          />
          <Password
            name="password"
            // placeholder={`${formatMessage({ id: 'app.login.password' })}: ant.design`}
            placeholder={`${formatMessage({ id: 'app.login.password' })}`}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'validation.password.required' }),
              },
            ]}
            onPressEnter={e => {
              e.preventDefault();
              this.loginForm.validateFields(this.handleSubmit);
            }}
          />
        </Tab>
        {/* <Tab key="mobile" tab={formatMessage({ id: 'app.login.tab-login-mobile' })}>
        {login.status === 'error' &&
          login.type === 'mobile' &&
          !submitting &&
          this.renderMessage(
            formatMessage({ id: 'app.login.message-invalid-verification-code' })
          )}
        <Mobile
          name="mobile"
          placeholder={formatMessage({ id: 'form.phone-number.placeholder' })}
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'validation.phone-number.required' }),
            },
            {
              pattern: /^1\d{10}$/,
              message: formatMessage({ id: 'validation.phone-number.wrong-format' }),
            },
          ]}
        />
        <Captcha
          name="captcha"
          placeholder={formatMessage({ id: 'form.verification-code.placeholder' })}
          countDown={120}
          onGetCaptcha={this.onGetCaptcha}
          getCaptchaButtonText={formatMessage({ id: 'form.get-captcha' })}
          getCaptchaSecondText={formatMessage({ id: 'form.captcha.second' })}
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'validation.verification-code.required' }),
            },
          ]}
        />
      </Tab> */}
        {/* <div>
        <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
          <FormattedMessage id="app.login.remember-me" />
        </Checkbox>
        <a style={{ float: 'right' }} href="">
          <FormattedMessage id="app.login.forgot-password" />
        </a>
      </div> */}
        <Submit loading={submitting}>
          <FormattedMessage id="app.login.login" />
        </Submit>
        {/* <div className={styles.other}>
        <FormattedMessage id="app.login.sign-in-with" />
        <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
        <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
        <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
        <Link className={styles.register} to="/user/register">
          <FormattedMessage id="app.login.signup" />
        </Link>
      </div> */}
      </Login>
    </div>


    return (
      loading ?
        <PageLoading />
        :
        <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
          <div className={styles.container}>
            <div className={styles.lang}>
              <SelectLang />
            </div>
            <div className={styles.content}>
              <div className={styles.top}>
                <div className={styles.header}>
                  <Link to="/">
                    <img alt="logo" className={styles.logo} src={logo} />
                    <span className={styles.title}>
                      <FormattedMessage id="app.title" />
                    </span>
                  </Link>
                </div>
                <div className={styles.desc}>
                  <FormattedMessage id="app.description" />
                </div>
              </div>
              {loginContent}
            </div>
            <GlobalFooter links={links} copyright={copyright} />
          </div>
        </DocumentTitle>
    );
  }
}

export default LoginPage;
