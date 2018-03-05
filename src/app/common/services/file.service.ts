import { Injectable, Inject } from '@angular/core';
import { Store, Config } from '../utils';

declare let cordova;
declare let FileTransfer;

@Injectable()
export class FileService {
    private appRoot: any;
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

    private checkFileName(filePath) {
        return !!filePath.slice((filePath.lastIndexOf(".") - 1 >>> 0) + 2);
    }

    getRootURL() {
        return this.appRoot.toInternalURL();
    }

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
}