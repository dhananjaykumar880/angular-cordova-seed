export interface IActionBarConfig {
    isBack?: Boolean;
    back?: IActionBack;
    title?: IActionTitle;
    isSideBar?: Boolean;
    isHome?: Boolean;
    isSync?: Boolean;
    isLogout?: Boolean;
    isClose?: Boolean;
}

export interface IActionBack {
    isBack?: Boolean;
    isVisible?: Boolean;
}

export interface IActionTitle {
    isHomeTitle?: Boolean;
    isTextTitle?: Boolean;
    text?: String;
}