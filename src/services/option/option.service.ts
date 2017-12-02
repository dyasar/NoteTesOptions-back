import { Injectable } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import {OPTION} from '../../data';
import {Option} from '../../interfaces';

import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';
import { _throw } from 'rxjs/observable/throw';
import { find, flatMap, findIndex, tap, map, filter } from 'rxjs/operators';
import { Biim } from '@hapiness/biim';
import { HapinessHTTPHandlerResponse } from '@hapiness/core/extensions/http-server';
import { mergeStatic } from 'rxjs/operators/merge';

@Injectable()
export class OptionService {
    // private property to store all option
    private _option: Option[];

    /**
     * Class constructor
     */
    constructor() {
        this._option = OPTION as Option[];
    }

    /**
     * Returns all existing option in the list
     *
     * @returns {Observable<Option[]>}
     */
    listAll(): Observable<Option[] | void> {
        return of(
            of(this._option)
        )
            .pipe(
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
     * Returns one option of the list matching id in parameter
     *
     * @param {string} id of the option
     *
     * @returns {Observable<Option>}
     */
    one(id: string): Observable<Option> {
        return from(this._option)
            .pipe(
                find(_ => _.id === id),
                flatMap(_ => !!_ ?
                    of(_) :
                    _throw(Biim.notFound(`Option with id '${id}' not found`))
                )
            );
    }

    /**
     * Check if option already exists and add it in option list
     *
     * @param option to create
     *
     * @returns {Observable<HapinessHTTPHandlerResponse>}
     */
    create(opt: Option): Observable<HapinessHTTPHandlerResponse> {
        return from(this._option)
            .pipe(
                find(_ => _.nom.toLowerCase() === opt.nom.toLowerCase()),
                flatMap(_ => !!_ ?
                    _throw(
                        Biim.conflict(`Option with nom '${opt.nom}'already exists`)
                    ) :
                    this._addOption(opt)
                )
            );
    }

    /**
     * Update a option in people list
     *
     * @param {string} id of the option to update
     * @param option data to update
     *
     * @returns {Observable<Option>}
     */
    update(id: string, opt: Option): Observable<Option> {
        return of(this._findOptionIndexOfList(id))
            .pipe(
                flatMap(_ =>
                    _.pipe(
                        tap(__ => this._option[__] = Object.assign(opt, {id})),
                        map(__ => this._option[__])
                    )
                )
            );
    }

    /**
     * Deletes on option in option list
     *
     * @param {string} id of the option to delete
     *
     * @returns {Observable<any>}
     */
    delete(id: string): Observable<void> {
        return of(this._findOptionIndexOfList(id))
            .pipe(
                flatMap(_ =>
                    _.pipe(
                        tap(__ => this._option.splice(__, 1)),
                        map(__ => undefined)
                    )
                )
            );
    }

    /**
     * Add option with good data in option list
     *
     * @param option to add
     *
     * @returns {Observable<Option>}
     *
     * @private
     */
    private _addOption(opt: Option): Observable<HapinessHTTPHandlerResponse> {
        opt.id = this._createId();
        this._option = this._option.concat(opt);
        return of({ response: opt, statusCode: 201 });
    }

    /**
     * Finds index of array for current option
     *
     * @param {string} id of the option to find
     *
     * @returns {Observable<number>}
     *
     * @private
     */
    private _findOptionIndexOfList(id: string): Observable<number> {
        return from(this._option)
            .pipe(
                findIndex(_ => _.id === id),
                flatMap(_ => _ > -1 ?
                    of(_) :
                    _throw(Biim.notFound(`Option with id '${id}' not found`))
                )
            );
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
