import { Injectable } from '@hapiness/core';
import { MongoClientService } from '@hapiness/mongo';
import { MongooseDocument } from 'mongoose';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { flatMap, filter, map } from 'rxjs/operators';
import { mergeStatic } from 'rxjs/operators/merge';

import { OptionModel } from '../../models';
import { Option } from '../../interfaces';
import { Config } from '@hapiness/config';
import {_throw} from 'rxjs/observable/throw';

@Injectable()
export class OptionDocumentService {
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
        }, OptionModel);
    }


    /**
     * Call mongoose method, call toJSON on each result and returns Option[] or undefined
     *
     * @return {Observable<Option[] | void>}
     */
    find(): Observable<Option[] | void> {
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
     * Returns one option of the list matching id in parameter
     *
     * @param {string} id of the option in the db
     *
     * @return {Observable<Option | void>}
     */
    findById(id: string): Observable<Option | void> {
        return fromPromise(this._document.findById(id))
            .pipe(
                flatMap((doc: MongooseDocument) =>
                    !!doc ?
                        of(doc.toJSON() as Option) :
                        of(undefined)
                )
            )
    }

    /**
     * Check if option already exists and add it in option list
     *
     * @param {Option} option to create
     *
     * @return {Observable<Option>}
     */
    create(opt: Option): Observable<Option> {
        return fromPromise(this._document.findOne({
            nom: { $regex: new RegExp(opt.nom, 'i') }
        }))
            .pipe(
                flatMap(_ => !!_ ?
                    _throw(
                        new Error(`Option with name '${opt.nom}' already exists`)
                    ) :
                    fromPromise(this._document.create(opt))
                ),
                map((doc: MongooseDocument) => doc.toJSON() as Option)
            );
    }

    /**
     * Update a option in option list
     *
     * @param {string} id
     * @param {Option} person
     *
     * @return {Observable<Option>}
     */
    findByIdAndUpdate(id: string, opt: Option): Observable<Option> {
        return fromPromise(this._document.findByIdAndUpdate(id, opt, { new: true }))
            .pipe(
                flatMap((doc: MongooseDocument) =>
                    !!doc ?
                        of(doc.toJSON() as Option) :
                        of(undefined)
                )
            )
    }
     /**
     * Delete a option in option list
     *
     * @param {string} id
     *
     * @return {Observable<Option>}
     */
    findByIdAndRemove(id: string): Observable<Option> {
        return fromPromise(this._document.findByIdAndRemove(id))
            .pipe(
                flatMap((doc: MongooseDocument) =>
                    !!doc ?
                        of(doc.toJSON() as Option) :
                        of(undefined)
                )
            )
    }
}
