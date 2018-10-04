/**
 * Interface for Actionbar buttons and there values
 */
export interface IActionBarConfig {
    isBack?: Boolean;
    title?: IActionTitle;
    isSideBar?: Boolean;
    isHome?: Boolean;
    isSync?: Boolean;
    isLogout?: Boolean;
    isClose?: Boolean;
}

/**
 * Interface for Title in Action bar (Only text/ Text with logo)
 */
export interface IActionTitle {
    isHomeTitle?: Boolean;
    isTextTitle?: Boolean;
    text?: String;
}
