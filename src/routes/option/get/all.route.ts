import { OnGet, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import { OptionService } from '../../../services';
import { Option } from '../../../interfaces';
import * as Joi from 'joi';

@Route({
    path: '/api/option',
    method: 'GET',
    config: {
        response: {
            status: {
                200: Joi.array().items(
                    Joi.object().keys({
                        id: Joi.string().required(),
                        nom: Joi.string().required(),
                        description: Joi.string().min(10).required(),
                        prof: Joi.string().required()
                    })
                ).unique().min(1)
            }
        },
        description: 'Get all option',
        notes: 'Returns an array of option or 204',
        tags: ['api', 'option']
    }
})
export class GetAllOptionRoute implements OnGet {
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
    onGet(request: Request): Observable<Option[] | void> {
        return this._optionService.listAll();
    }
}
