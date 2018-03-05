import { Injectable } from "@angular/core";
import { Config } from "../utils";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/observable/forkJoin";
import 'rxjs/add/operator/toPromise'
import { FileService } from "./file.service";

@Injectable()
export class SyncService {
    private allAssets: Array<string> = [];

    constructor(
        private fileService: FileService
    ) { }

    private loadImage(news) {
        return new Promise(resolve => {
            let iconId = news.iconUrl.split("/");
            iconId = iconId[iconId.length - 1];
            if (iconId) {
                this.loadImageFromServer(iconId).subscribe(url => {
                    resolve({ "iconUrl": url });
                });
            } else {
                resolve({ "iconUrl": news.iconUrl });
            }
        });
    }

    private loadAttachments(link) {
        return new Promise(resolve => {
            this.loadAttachmentsFromServer(link.id, link.fileName).subscribe(filePath => {
                resolve({
                    "type": "ATTACHMENT",
                    "id": link.id,
                    "filePath": filePath
                });
            })
        });
    }

    private loadLinks(news) {
        return Observable.forkJoin(
            news.links.map((link, index) => {
                let promise;
                switch (link.type) {
                    case 'ATTACHMENT':
                        promise = this.loadAttachments(link);
                        break;
                    default:
                        break;
                }
                return promise;
            })
        ).toPromise();
    }

    private loadImageFromServer(iconId): Observable<string> {
        let filePath = "assets/icons/" + iconId + ".png";

        return Observable.fromPromise(
            this.fileService.download(Config.ASSET_URL + iconId, filePath)
        ).map((res: string) => res)
    }

    private loadAttachmentsFromServer(attachmentId, fileName): Observable<string> {
        let filePath = "assets/attachments/" + fileName;

        return Observable.fromPromise(
            this.fileService.download(Config.ATTACHMENT_URL + "?id=" + attachmentId, filePath)
        ).map((res: string) => res)
    }

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

    private loadAndReplaceAssetsForOne(news) {
        return Observable.forkJoin([
            this.loadImage(news),
            this.loadLinks(news)
        ]).toPromise().then(updates => {
            let icon: any = updates[0], links: any = updates[1];
            // update icon url
            news.iconUrl = icon.iconUrl;

            // update links url if neccessary
            if (links) {
                links.map(link => {
                    switch (link.type) {
                        case "ATTACHMENT":
                            news.description = this.updateAttachmentPath(news.shortText, link.id, link.filePath);
                            break;
                        default:
                            break;
                    }
                })
            }
            return news;
        });
    }

    loadAndReplaceAssetsForAll(allNews: Array<any>) {
        return Observable.forkJoin(
            allNews.map(news => {
                return this.loadAndReplaceAssetsForOne(news);
            })
        ).toPromise().then(news => {
            return news;
        });
    }
}