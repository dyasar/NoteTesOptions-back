import { OnGet, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { OPTION } from '../../../data';
import { Option } from '../../../interfaces';

@Route({
    path: '/api/option',
    method: 'GET'
})
export class GetAllOptionRoute implements OnGet {
    /**
     * OnGet implementation
     * @param request
     */
    onGet(request: Request): Observable<Option[]> {
        return of(OPTION as Option[]);
    }
}
