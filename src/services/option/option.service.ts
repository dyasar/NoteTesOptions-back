import { Injectable } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import {OPTION} from '../../data';
import {Option} from '../../interfaces';

import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';
import { _throw } from 'rxjs/observable/throw';
import { find, flatMap } from 'rxjs/operators';
import { Biim } from '@hapiness/biim';

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
    listAll(): Observable<Option[]> {
        return of(this._option);
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
}
