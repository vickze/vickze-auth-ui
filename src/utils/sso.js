import { stringify } from 'qs';

export function ssoLogin(href) {
    const query = {
        systemKey: SYSTEM_KEY,
        service: href,
    }
    //(SSO + "?" + stringify(query))
    window.location.href = SSO + "?" + stringify(query);
}


export function ssoLogout(href) {
    const query = {
        logout: true,
        systemKey: SYSTEM_KEY,
        service: href,
    }
    //console.log(SSO + "?" + stringify(query))
    window.location.href = SSO + "?" + stringify(query);
}