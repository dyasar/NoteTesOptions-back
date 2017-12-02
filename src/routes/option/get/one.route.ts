import { OnGet, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import { Option } from '../../../interfaces';
import { OptionService } from '../../../services';

@Route({
    path: '/api/option/{id}',
    method: 'GET'
})
export class GetOneOptionRoute implements OnGet {
    /**
     * Class constructor
     * @param _optionService
     */
    constructor(private _optionService: OptionService) {
    }

    /**
     * OnGet implementation
     * @param request
     */
    onGet(request: Request): Observable<Option> {
        return this._optionService.one(request.params.id);
    }
}