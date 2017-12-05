import { OnGet, Route, Request } from '@hapiness/core';
import { Observable } from 'rxjs/Observable';

import { Note } from '../../../interfaces';
import { NoteService } from '../../../services';
import * as Joi from 'joi';


@Route({
    path: '/api/note/{option_id}',
    method: 'GET',
    config: {
        validate: {
            params: {
                option_id: Joi.string().required()
            }
        },
        response: {
            status: {
                200: Joi.array().items({
                    id: Joi.string().required(),
                    option_id: Joi.string().required(),
                    commentaire: Joi.string().optional(),
                    note_prof: Joi.number().required(),
                    note_option: Joi.number().required(),
                    note_comprehension: Joi.number().required(),
                    note_difficulte_examen: Joi.number().required()
                }).unique().min(1)
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
     * @param _noteService
     */
    constructor(private _noteService: NoteService) {
    }

    /**
     * OnGet implementation
     * @param request
     */
    onGet(request: Request): Observable<Note[] | void> {
        return this._noteService.find(request.params.option_id);
    }
}
