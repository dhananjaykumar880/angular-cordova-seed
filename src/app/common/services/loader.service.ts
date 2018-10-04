import { Injectable, EventEmitter } from "@angular/core";

/**
 * LoadingService
 * this service is used for spinner show and hide
 */
@Injectable()
export class LoadingService {

    /**
     * will be use for subscribe
     */
    onLoadingChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * Stores all currently active requests
     */
    private requests: Array<any>[] = [];

    /**
     * Adds request to the storage and notifies observers
     */
    onStarted(req: any): void {
        this.requests.push(req);
        this.notify();
    }

    /**
     * Removes request from the storage and notifies observers
     */
    onFinished(req: any): void {
        const index = this.requests.indexOf(req);
        if (index !== -1) {
            this.requests.splice(index, 1);
        }
        this.notify();
    }

    /**
     * Notifies observers about whether there are any requests on fly
     */
    private notify(): void {
        this.onLoadingChanged.emit(this.requests.length !== 0);
    }
}
