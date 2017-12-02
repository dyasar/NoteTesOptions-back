import { OnPut, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import { OptionService } from '../../../services';
import { Option } from '../../../interfaces';
import * as Joi from 'joi';


@Route({
    path: '/api/option/{id}',
    method: 'PUT',
    config: {
        validate: {
            params: {
                id: Joi.string().required()
            },
            payload: Joi.object().keys({
                nom: Joi.string().required(),
                description: Joi.string().min(10).required(),
                prof: Joi.string().required()
            })
        },
        payload: {
            output: 'data',
            allow: 'application/json',
            parse: true
        },
        response: {
            status: {
                201: Joi.object().keys({
                    id: Joi.string().required(),
                    nom: Joi.string().required(),
                    description: Joi.string().min(10).required(),
                    prof: Joi.string().required()
                })
            }
        },
        description: 'Update one option',
        notes: 'Update the option for the given id in path parameter and return it',
        tags: ['api', 'option']
    }
})
export class PutUpdateOptionRoute implements OnPut {
    /**
     * Class constructor
     * @param _optionService
     */
    constructor(private _optionService: OptionService) {
    }

    /**
     * OnPut implementation
     * @param request
     */
    onPut(request: Request): Observable<Option> {
        return this._optionService.update(request.params.id, request.payload);
    }
}
