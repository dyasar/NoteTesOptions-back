import { OnDelete, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';
import { OptionService } from '../../../services';
import * as Joi from 'joi';

@Route({
    path: '/api/option/{id}',
    method: 'DELETE',
    config: {
        validate: {
            params: {
                id: Joi.string().required()
            }
        },
        description: 'Delete option',
        notes: 'Delete one option for the given id in path parameter',
        tags: ['api', 'option']
    }
})
export class DeleteOneOptionRoute implements OnDelete {
    /**
     * Class constructor
     * @param _optionService
     */
    constructor(private _optionService: OptionService) {
    }

    /**
     * OnDelete implementation
     * @param request
     */
    onDelete(request: Request): Observable<void> {
        return this._optionService.delete(request.params.id);
    }
}
