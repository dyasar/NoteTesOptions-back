import { OnGet, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import { Option } from '../../../interfaces';
import { OptionService } from '../../../services';
import * as Joi from 'joi';


@Route({
    path: '/api/option/{id}',
    method: 'GET',
    config: {
        validate: {
            params: {
                id: Joi.string().required()
            }
        },
        response: {
            status: {
                200: Joi.object().keys({
                    id: Joi.string().required(),
                    nom: Joi.string().required(),
                    description: Joi.string().min(10).required(),
                    prof: Joi.string().required()
                })
            }
        },
        description: 'Get one option',
        notes: 'Returns one option for the given id in path parameter',
        tags: ['api', 'option']
    }

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
