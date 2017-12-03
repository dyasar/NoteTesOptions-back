import { Injectable } from '@hapiness/core';
import { MongoClientService } from '@hapiness/mongo';
import { MongooseDocument } from 'mongoose';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { flatMap, filter, map } from 'rxjs/operators';
import { mergeStatic } from 'rxjs/operators/merge';
import { _throw } from 'rxjs/observable/throw';

import { NoteModel } from '../../models';
import { Note } from '../../interfaces';
import { Config } from '@hapiness/config';

@Injectable()
export class NoteDocumentService {
    // private property to store document instance
    private _document: any;

    /**
     * Class constructor
     *
     * @param {MongoClientService} _mongoClientService
     */
    constructor(private _mongoClientService: MongoClientService) {
        this._document = this._mongoClientService.getModel({
            adapter: 'mongoose',
            options: Config.get('mongodb')
        }, NoteModel);
    }

    /**
     * Call mongoose method, call toJSON on each result and returns Note[] or undefined
     *
     * @return {Observable<Note[] | void>}
     */
    find(): Observable<Note[] | void> {
        return fromPromise(this._document.find({}))
            .pipe(
                flatMap((docs: MongooseDocument[]) =>
                    of(of(docs))
                        .pipe(
                            flatMap(_ =>
                                mergeStatic(
                                    _.pipe(
                                        filter(__ => !!__ && __.length > 0),
                                        map(__ => __.map(doc => doc.toJSON())),
                                    ),
                                    _.pipe(
                                        filter(__ => !__ || __.length === 0),
                                        map(__ => undefined)
                                    )
                                )
                            )
                        )
                )
            );
    }

    /**
     *
     * @param {Note} note to create
     *
     * @return {Observable<Note>}
     */
    create(n: Note): Observable<Note> {
        return fromPromise(this._document.findOne({
            id: {$regex: new RegExp(n.id, 'i')}}))
            .pipe(
                flatMap(_ => !!_ ?
                    _throw(
                        new Error(`Note with id '${n.id}' already exists`)
                    ) :
                    fromPromise(this._document.create(n))
                ),
                map((doc: MongooseDocument) => doc.toJSON() as Note)
            );
    }
}
