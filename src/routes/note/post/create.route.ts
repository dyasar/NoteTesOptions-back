import { OnPost, Route, Request } from '@hapiness/core';
import { HapinessHTTPHandlerResponse } from '@hapiness/core/extensions/http-server';
import { Observable } from 'rxjs/Observable';

import { NoteService } from '../../../services';
import { Note } from '../../../interfaces';
import * as Joi from 'joi';


@Route({
    path: '/api/note/{option_id}',
    method: 'POST',
    config: {
            validate: {
                params: {
                    option_id: Joi.string().required()
                },
            payload: Joi.object().keys({
                option_id: Joi.string().required(),
                commentaire: Joi.string().optional(),
                note_prof: Joi.number().min(0).max(5).required(),
                note_option: Joi.number().min(0).max(5).required(),
                note_compréhension: Joi.number().min(0).max(5).required(),
                note_difficulté_examen: Joi.number().min(0).max(5).required()
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
                    option_id: Joi.string().required(),
                    commentaire: Joi.string().optional(),
                    note_prof: Joi.number().min(0).max(5).required(),
                    note_option: Joi.number().min(0).max(5).required(),
                    note_compréhension: Joi.number().min(0).max(5).required(),
                    note_difficulté_examen: Joi.number().min(0).max(5).required()
                })
            }
        },
        description: 'Create one note',
        notes: 'Create a new note and return it',
        tags: ['api', 'note']
    }
})
export class PostCreateNoteRoute implements OnPost {
    /**
     * Class constructor
     * @param _noteService
     */
    constructor(private _noteService: NoteService) {
    }

    /**
     * OnPost implementation
     * @param request
     */
    onPost(request: Request): Observable<HapinessHTTPHandlerResponse> {
        return this._noteService.create(request.payload as Note, request.params.option_id);
    }
}
