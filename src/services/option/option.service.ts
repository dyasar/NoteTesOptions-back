import { Injectable } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import {OPTION} from '../../data';
import {Option} from '../../interfaces';

import { of } from 'rxjs/observable/of';

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
}
