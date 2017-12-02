import { OnPost, Route, Request } from '@hapiness/core';
import { HapinessHTTPHandlerResponse } from '@hapiness/core/extensions/http-server';
import { Observable } from 'rxjs/Observable';

import { OptionService } from '../../../services';
import { Option } from '../../../interfaces';
import * as Joi from 'joi';


@Route({
    path: '/api/option',
    method: 'POST',
    config: {
        validate: {
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
        description: 'Create one option',
        notes: 'Create a new option and return it',
        tags: ['api', 'option']
    }
})
export class PostCreateOptionRoute implements OnPost {
    /**
     * Class constructor
     * @param _optionService
     */
    constructor(private _optionService: OptionService) {
    }

    /**
     * OnPost implementation
     * @param request
     */
    onPost(request: Request): Observable<HapinessHTTPHandlerResponse> {
        return this._optionService.create(request.payload as Option);
    }
}
