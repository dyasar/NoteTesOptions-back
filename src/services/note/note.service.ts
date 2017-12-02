import { Injectable } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import {NOTE} from '../../data';
import {Note} from '../../interfaces';

import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';
import { _throw } from 'rxjs/observable/throw';
import { find, flatMap } from 'rxjs/operators';
import { Biim } from '@hapiness/biim';
import { HapinessHTTPHandlerResponse } from '@hapiness/core/extensions/http-server';

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
    /**
     * Returns one note of the list matching id in parameter
     *
     * @param {string} id of the note
     *
     * @returns {Observable<Note>}
     */
    one(id: string): Observable<Note> {
        return from(this._note)
            .pipe(
                find(_ => _.option_id === id),
                flatMap(_ => !!_ ?
                    of(_) :
                    _throw(Biim.notFound(`Option with id '${id}' not found`))
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
