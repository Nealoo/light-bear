export function setLoginStatus(){
    localStorage.setItem('bearLogin', true);
}

export function getLoginStatus(){
    return localStorage.getItem('bearLogin');
}

export function clearLoginStatus(){
    localStorage.setItem('bearLogin', false);
}

export function setUserInfo(userName, key){
    localStorage.setItem('bearName', userName);
    localStorage.setItem('bearKey', key);
}

export function getUserInfo(){
    const name = localStorage.getItem('bearName');
    const key  = localStorage.getItem('bearKey');
    return {'userName': name, 'key': key}
}

export function clearUserInfo(){
    localStorage.removeItem('bearName');
    localStorage.removeItem('bearKey');
    localStorage.removeItem('bearLogin');
}