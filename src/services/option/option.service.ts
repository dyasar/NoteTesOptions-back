import { Injectable } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import {Option} from '../../interfaces';
import { OptionDocumentService } from '../option-document';


import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { flatMap, map, catchError } from 'rxjs/operators';
import { Biim } from '@hapiness/biim';
import { HapinessHTTPHandlerResponse } from '@hapiness/core/extensions/http-server';

@Injectable()
export class OptionService {
    // private property to store all option

    /**
     * Class constructor
     */
    constructor(private _optionDocumentService: OptionDocumentService) {
    }

    /**
     * Returns all existing option in the list
     *
     * @returns {Observable<Option[]>}
     */
    listAll(): Observable<Option[] | void> {
        return this._optionDocumentService.find();
    }

    /**
     * Returns one option of the list matching id in parameter
     *
     * @param {string} id of the option
     *
     * @returns {Observable<Option>}
     */
    one(id: string): Observable<Option> {
        return this._optionDocumentService.findById(id)
            .pipe(
                catchError(e =>  _throw(Biim.preconditionFailed(e.message))),
                flatMap(_ =>
                    !!_ ?
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
        return this._optionDocumentService.create(opt)
            .pipe(
                catchError(e => _throw(Biim.conflict(e.message))),
                map(_ => ({ response: _, statusCode: 201 }))
            );
    }

     /**
     * Update a option in option list
     *
     * @param {string} id of the option to update
     * @param option data to update
     *
     * @returns {Observable<Option>}
     */
    update(id: string, opt: Option): Observable<Option> {
        return this._optionDocumentService.findByIdAndUpdate(id, opt)
            .pipe(
                catchError(e => _throw(Biim.preconditionFailed(e.message))),
                flatMap(_ =>
                    !!_ ?
                        of(_) :
                        _throw(Biim.notFound(`Option with id '${id}' not found`))
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
        return this._optionDocumentService.findByIdAndRemove(id)
            .pipe(
                catchError(e => _throw(Biim.preconditionFailed(e.message))),
                flatMap(_ =>
                    !!_ ?
                        of(undefined) :
                        _throw(Biim.notFound(`Option with id '${id}' not found`))
                )
            );
    }

}
