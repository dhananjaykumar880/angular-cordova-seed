import { Injectable, Inject } from '@angular/core';
import { Store, Config } from '../utils';

declare let cordova;
declare let FileTransfer;

/**
 * File service
 * access persistent location into touch device
 * save and access local files
 */
@Injectable()
export class FileService {
    private appRoot: any;

    /**
     * Constructor with service injection
     * initialise persistent location of touch device
     * @param store 
     * @param window 
     */
    constructor(
        private store: Store,
        @Inject("WINDOW") private window: any
    ) {
        if (typeof this.window['cordova'] !== 'undefined') {
            this.window.resolveLocalFileSystemURL(cordova.file.dataDirectory, root => {
                this.appRoot = root;
                Config.FILE_ROOT_URL = this.appRoot.toInternalURL();
            }, error => {
                console.log(error);
            });
        }
    }

    /**
     * check file name is valid or not
     * @param filePath with extension
     */
    private checkFileName(filePath) {
        return !!Config.getExtenstion(filePath);
    }

    /**
     * get root folder url in cdvfile:// format
     */
    getRootURL() {
        return this.appRoot.toInternalURL();
    }

    isExist(filePath: string) {
        return new Promise(resolve => {
            this.window.resolveLocalFileSystemURL(Config.FILE_ROOT_URL + filePath, () => {
                resolve(true);
            }, () => {
                resolve(false);
            });
        })
    }

    /**
     * Get folder entry from given root
     * @param folderPath is target folder
     * @param fromFolder is root folder from you want to get target folder
     */
    getFolder(folderPath, fromFolder = this.appRoot) {
        return new Promise((resolve, reject) => {
            let pos = folderPath.indexOf('/'),
                folder = folderPath.substr(0, pos),
                restPath = folderPath.substr(pos + 1);

            if (pos === -1) {
                folder = restPath;
                restPath = "";
            }
            fromFolder.getDirectory(folder, { create: true }, dirEnter => {
                if (restPath.length > 1) {
                    resolve(this.getFolder(restPath, dirEnter));
                } else {
                    resolve(dirEnter);
                }
            }, error => {
                reject(error);
            });

        })
    }

    /**
     * Get file entry based on location and file name
     * @param filePath is file location with file name
     */
    getFile(filePath: string) {
        return new Promise((resolve, reject) => {
            let temp = filePath.split('/'),
                fileName = temp.pop(),
                folderPath = temp.join('/');
            if (!this.checkFileName(fileName)) {
                reject("file name is not correct.");
            }

            this.getFolder(folderPath).then((folder: any) => {
                folder.getFile(fileName, { create: true, exclusive: false }, fileEntry => {
                    resolve(fileEntry);
                }, error => {
                    reject(error);
                })
            })
        })
    }

    /**
     * Download any type of file from given url to given file location
     * @param url from where content will be download
     * @param filePath is where content will be save
     */
    download(url: string, filePath: string) {
        return new Promise((resolve, reject) => {
            this.getFile(filePath).then((fileEntry: any) => {
                let token = this.store.get("token"),
                    fileTransfer = new FileTransfer();

                fileTransfer.download(
                    url,
                    fileEntry.toURL(),
                    entry => {
                        console.log("download complete: " + entry.toInternalURL());
                        resolve(entry.toInternalURL());
                    },
                    error => {
                        console.log("download error source " + error.source);
                        console.log("download error target " + error.target);
                        console.log("download error code" + error.code);
                        reject(error);
                    },
                    false,
                    {
                        headers: {
                            "Authorization": "Bearer " + token.access_token
                        }
                    }
                );
            })
        })
    }

    /**
     * Save content with given filename into touch device
     * @param filename is a file name with file location
     * @param content is save into given file name
     */
    saveToApp(filename: string, content: any) {
        this.getFile(filename).then((fileEntry: any) => {

            fileEntry.createWriter(fileWriter => {
                fileWriter.onwriteend = () => {
                    console.log("Successful file write..." + filename);
                };

                fileWriter.onerror = (e) => {
                    console.log("Failed file write: ", e);
                };
                fileWriter.write(content);
            })
        });
    }

    /**
     * Check all directory and files and delete old file
     * @param path local file/folder location
     */
    cleanOldAssetIfAvailable(ignoreArray: Array<any>, path: string = "/") {
        let currentDate = (new Date()).getTime() - 3600 * 1000;
        this.getFolder(path).then((dirEntry: any) => {
            dirEntry.createReader().readEntries(entries => {
                entries.forEach(entry => {
                    if (entry.isFile) {
                        entry.file(file => {
                            let name = file.name.substr(0, file.name.lastIndexOf('.')),
                                ignore = ignoreArray.filter(ig => ig.indexOf(name) > -1).length > 0;

                            if (!ignore && currentDate > file.lastModified) {
                                entry.remove(() => {
                                    console.log("removed" + file.name);
                                }, () => {
                                    console.log("encountered error" + file.name);
                                });
                            }
                        })
                    } else {
                        this.cleanOldAssetIfAvailable(ignoreArray, entry.fullPath.substr(1, entry.fullPath.length - 1));
                    }
                });
            });
        });
    }
}
