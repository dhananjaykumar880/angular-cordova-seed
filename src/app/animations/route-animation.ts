import { animate, style, transition, trigger, query, group } from '@angular/animations';

export const routeAnimation = trigger("routeAnimation", [
    transition('* <=> *', [
        group([
            query(':enter, :leave', [
                style({ position: 'fixed', 'width': '100%' }),
                query('mat-toolbar', style({ position: 'fixed', top: '-64px' }), { optional: true }),
            ], { optional: true }),
            query(':enter', style({ transform: 'translate3d(100%, 0, 0)', 'opacity': 0 }), { optional: true }),
        ]),
        group([
            query('.slide-left :enter', [
                style({ transform: 'translate3d(100%, 0, 0)' }),
                animate('0.5s ease-in-out', style({ 'opacity': 1, transform: 'translate3d(0, 0, 0)' }))
            ], { optional: true }),
            query('.slide-left :leave', [
                style({ transform: 'translate3d(0, 0, 0)' }),
                animate('0.5s ease-in-out', style({ transform: 'translate3d(-100%, 0, 0)' }))
            ], { optional: true }),
            query('.slide-right :enter', [
                style({ transform: 'translate3d(-100%, 0, 0)' }),
                animate('0.5s ease-in-out', style({ 'opacity': 1, transform: 'translate3d(0, 0, 0)' }))
            ], { optional: true }),
            query('.slide-right :leave', [
                style({ transform: 'translate3d(0, 0, 0)' }),
                animate('0.5s ease-in-out', style({ transform: 'translate3d(100%, 0, 0)' }))
            ], { optional: true })
        ])
    ])
]);