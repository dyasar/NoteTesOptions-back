import { OnGet, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import { Note } from '../../../interfaces';
import { NoteService } from '../../../services';
import * as Joi from 'joi';


@Route({
    path: '/api/note/{id}',
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
                    option_id: Joi.string().required(),
                    commentaire: Joi.string().optional(),
                    note_prof: Joi.number().required(),
                    note_option: Joi.number().required(),
                    note_compréhension: Joi.number().required(),
                    note_difficulté_examen: Joi.number().required()
                })
            }
        },
        description: 'Get one note',
        notes: 'Returns one note for the given id in path parameter',
        tags: ['api', 'note']
    }

})
export class GetOneNoteRoute implements OnGet {
    /**
     * Class constructor
     * @param _onoteService
     */
    constructor(private _noteService: NoteService) {
    }

    /**
     * OnGet implementation
     * @param request
     */
    onGet(request: Request): Observable<Note> {
        return this._noteService.one(request.params.id);
    }
}
