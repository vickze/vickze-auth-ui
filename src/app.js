import { setToken } from '@/utils/token';
import { getPageQuery, urlOriginCompare } from '@/utils/utils';

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
    },
  },
};

export function render(oldRender) {
  //接入单点登录
  if (SSO) {
    const urlParams = new URL(window.location.href);
    const params = getPageQuery();
    let { source } = params;
    //source为单点登录地址不渲染页面，只做接受token事件
    if (!urlOriginCompare(source, SSO)) {
      oldRender();
    } else {
      if (SSO) {
        window.addEventListener("message", () => {
          if (urlOriginCompare(event.origin, SSO)) {
            setToken(event.data.token)
            //给父窗口发送消息跳转
            parent.postMessage(event.data.service, event.origin);
          }
        }, false);
      }
    }
  } else {
    oldRender();
  }
}



