import { Injectable } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import {Note} from '../../interfaces';
import { NoteDocumentService } from '../note-document';


import { _throw } from 'rxjs/observable/throw';
import { map, catchError } from 'rxjs/operators';
import { Biim } from '@hapiness/biim';
import { HapinessHTTPHandlerResponse } from '@hapiness/core/extensions/http-server';




@Injectable()
export class NoteService {

    /**
     * Class constructor
     */
    constructor(private _noteDocumentService: NoteDocumentService) {
    }


    one(id: string):  Observable<Note[] | void> {
        return this._noteDocumentService.find();
    }


    /**
     * add note in note list
     *
     * @param note to create
     *
     * @returns {Observable<HapinessHTTPHandlerResponse>}
     */
    create(id: string, n: Note): Observable<HapinessHTTPHandlerResponse> {
        return this._noteDocumentService.create(id, n)
            .pipe(
                catchError(e => _throw(Biim.conflict(e.message))),
                map(_ => ({ response: _, statusCode: 201 }))
            );
    }
}
