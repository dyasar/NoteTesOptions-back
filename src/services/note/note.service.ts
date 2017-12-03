import { Injectable } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import {NOTE} from '../../data';
import {Note} from '../../interfaces';

import { of } from 'rxjs/observable/of';
import { HapinessHTTPHandlerResponse } from '@hapiness/core/extensions/http-server';
import { flatMap, map, filter } from 'rxjs/operators';
import { mergeStatic } from 'rxjs/operators/merge';



@Injectable()
export class NoteService {
    // private property to store all note
    private _note: Note[];

    /**
     * Class constructor
     */
    constructor() {
        this._note = NOTE as Note[];
    }
    one(id: string):  Observable<Note[] | void> {
        return of(
            of(this._note)
        )            .pipe(
            flatMap(_ =>
                mergeStatic(
                    _.pipe(
                        filter(__ => !!__ && __.length > 0),
                        map(__ => __)
                    ),
                    _.pipe(
                        filter(__ => !__ || __.length === 0),
                        map(__ => undefined)
                    )
                )
            )
        );
    }


    /**
     * Add note with good data in note list
     *
     * @param note to create
     * @param {string} id of the option
     *
     * @returns {Observable<HapinessHTTPHandlerResponse>}
     */
    create(id: string, n: Note): Observable<HapinessHTTPHandlerResponse> {
        n.id = this._createId();
        n.option_id = id;
        this._note = this._note.concat(n);
        return of({ response: n, statusCode: 201 });
    }

    /**
     * Creates a new id
     *
     * @returns {string}
     *
     * @private
     */
    private _createId(): string {
        return `${new Date().getTime()}`;
    }
}
