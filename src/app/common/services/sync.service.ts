import { Injectable } from "@angular/core";
import { Config } from "../utils";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/observable/forkJoin";
import 'rxjs/add/operator/toPromise'
import { FileService } from "./file.service";
import { HttpClient } from "@angular/common/http";

/**
 * SyncService
 * used for syncing all assets from server
 */
@Injectable()
export class SyncService {
    synced: Array<any> = [];

    /**
     * constructor with service injection
     * @param fileService 
     * @param http 
     */
    constructor(
        private fileService: FileService,
        private http: HttpClient
    ) { }

    /**
     * check for synced data
     * @param id string + number
     */
    private isSynced(id) {
        return this.synced.indexOf(id) !== -1 ? true : false;
    }

    /**
     * get icon from iconUrl
     * @param news is an object with iconUrl property
     */
    private loadIcons(news) {
        return new Promise((resolve, reject) => {
            if (news.iconUrl) {
                let iconId = news.iconUrl.split("/");
                iconId = iconId[iconId.length - 1];
                const filePath = "assets/icons/" + iconId + ".png";

                if (this.isSynced("I" + iconId)) {
                    this.fileService.getFile(filePath).then((fileEntry: any) => {
                        resolve({ "iconUrl": fileEntry.toInternalURL() });
                    });
                } else {
                    this.synced.push("I" + iconId);
                    this.loadIconsFromServer(iconId, filePath).subscribe(internalPath => {
                        resolve({ "iconUrl": internalPath });
                    })
                }
            } else {
                reject({ "iconUrl": news.iconUrl });
            }
        });
    }

    /**
     * get attachment from link id
     * @param link is an array of attachment data
     */
    private loadAttachments(link) {
        return new Promise((resolve, reject) => {
            let filePath = "assets/attachments/" + link.attachmentId + "." + Config.getExtenstion(link.fileName);
            this.fileService.isExist(filePath).then(isExist => {
                if (isExist) {
                    this.synced.push("A" + link.attachmentId);
                }
                if (this.isSynced("A" + link.attachmentId)) {
                    this.fileService.getFile(filePath).then((fileEntry: any) => {
                        resolve({
                            "type": "ATTACHMENT",
                            "id": link.id,
                            "filePath": fileEntry.toInternalURL()
                        });
                    });
                } else {
                    this.synced.push("A" + link.attachmentId);
                    this.loadAttachmentsFromServer(link.id, filePath).subscribe(internalPath => {
                        resolve({
                            "type": "ATTACHMENT",
                            "id": link.id,
                            "filePath": internalPath
                        });
                    })
                }
            });
        });
    }

    /**
     * get message from server and save into device
     * @param link is an array of message data
     */
    private loadMessage(link) {
        return new Promise((resolve, reject) => {
            if (this.isSynced("M" + link.messageId)) {
                reject({
                    "type": "MESSAGE"
                });
            } else {
                this.synced.push("M" + link.messageId);
                this.http.get(Config.MESSAGE_URL + link.messageId + "?refid=" + link.refMessageId).subscribe(news => {
                    this.loadAndReplaceAssetsForOne(news).then(news => {
                        this.fileService.saveToApp("news/" + link.messageId + ".json", JSON.stringify(news));
                    });
                    resolve({
                        "type": "MESSAGE"
                    });
                });
            }
        });
    }

    /**
     * load all available assets for given news
     * @param news is an object with links array
     */
    private loadLinks(news) {
        return Observable.forkJoin(
            news.links.map((link, index) => {
                let promise;
                switch (link.type) {
                    case 'ATTACHMENT':
                        promise = this.loadAttachments(link).catch(e => e);
                        break;
                    case 'MESSAGE':
                        promise = this.loadMessage(link).catch(e => e);
                        break;
                    default:
                        promise = new Promise(resolve => resolve([]));
                        break;
                }
                return promise;
            })
        ).toPromise();
    }

    /**
     * load icon from server and save to device
     * @param iconId 
     */
    private loadIconsFromServer(iconId, filePath): Observable<string> {
        return Observable.fromPromise(
            this.fileService.download(Config.ASSET_URL + iconId, filePath).catch(e => e)
        ).map((res: string) => res)
    }

    /**
     * load attachment from server and save to device
     * @param attachmentId 
     * @param fileName 
     */
    private loadAttachmentsFromServer(attachmentId, filePath): Observable<string> {
        return Observable.fromPromise(
            this.fileService.download(Config.ATTACHMENT_URL + "?id=" + attachmentId, filePath).catch(e => e)
        ).map((res: string) => res)
    }

    /**
     * update server src to local src in given content
     * @param content 
     * @param attachmentId 
     * @param filePath 
     */
    private updateAttachmentPath(content, attachmentId, filePath) {
        let imgRegexGlobal = new RegExp("<img.+src=\"(.+?)" + attachmentId + "\".+\/>", "g"),
            srcRegex = new RegExp("src=\"(.+?)\""),
            matches = content.match(imgRegexGlobal);

        if (matches) {
            matches.forEach(match => {
                let replaceMatch = match.replace(srcRegex, "src=\"" + filePath + "\"");
                content = content.replace(match, replaceMatch);
            });
        }
        return content;
    }

    /**
     * load all available icons and links
     * @param news is an object with icons and links
     */
    private loadAndReplaceAssetsForOne(news) {
        return Observable.forkJoin([
            this.loadIcons(news).catch(e => e),
            this.loadLinks(news).catch(e => e)
        ]).toPromise().then(updates => {
            let icon: any = updates[0], links: any = updates[1];
            // update icon url
            news.iconUrl = icon.iconUrl;

            // update links url if neccessary
            if (links) {
                links.map(link => {
                    switch (link.type) {
                        case "ATTACHMENT":
                            news.shortText = this.updateAttachmentPath(news.shortText, link.id, link.filePath);
                            news.longText.text = this.updateAttachmentPath(news.longText.text, link.id, link.filePath);
                            break;
                        case "MESSAGE":
                            break;
                        default:
                            break;
                    }
                })
            }
            return news;
        });
    }

    /**
     * load all assets from news
     * @param allNews is an array of all news
     */
    loadAndReplaceAssetsForAll(allNews: Array<any>) {
        this.synced = [];
        return Observable.forkJoin(
            allNews.map(news => {
                return this.loadAndReplaceAssetsForOne(news).catch(e => e);
            })
        ).toPromise().then(news => {
            return news;
        });
    }
}
