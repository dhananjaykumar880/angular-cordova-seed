/**
 * Interface for Actionbar buttons and there values
 */
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

/**
 * Interface for back button in Action bar based on visibility
 */
export interface IActionBack {
    isBack?: Boolean;
    isVisible?: Boolean;
}

/**
 * Interface for Title in Action bar (Only text/ Text with logo)
 */
export interface IActionTitle {
    isHomeTitle?: Boolean;
    isTextTitle?: Boolean;
    text?: String;
}
