import { HapinessModule, HttpServerService, OnError, OnStart } from '@hapiness/core';
import { LoggerModule, LoggerService } from '@hapiness/logger';
import { Observable } from 'rxjs/Observable';
import {GetAllOptionRoute, GetOneOptionRoute, PostCreateOptionRoute, PutUpdateOptionRoute, DeleteOneOptionRoute,
    GetOneNoteRoute, PostCreateNoteRoute} from './routes';
import {OptionService, NoteService, OptionDocumentService, NoteDocumentService} from './services';
import { SwagModule } from '@hapiness/swag';
import { Config } from '@hapiness/config';
import { MongoModule, MongoClientService } from '@hapiness/mongo';
import { OptionModel, NoteModel } from './models';

// factory to declare dependency between OptionDocumentService and MongoClientService
// we use it to be sure that MongoClientService will be loaded before OptionDocumentService
const optionDocumentFactory = (mongoClientService: MongoClientService) => new OptionDocumentService(mongoClientService);
// factory to declare dependency between NoteDocumentService and MongoClientService
// we use it to be sure that MongoClientService will be loaded before NoteDocumentService
const noteDocumentFactory = (mongoClientService2: MongoClientService) => new NoteDocumentService(mongoClientService2);

@HapinessModule({
    version: '1.0.0',
    imports: [
        LoggerModule,
        SwagModule.setConfig(Config.get('swag')) ,
        MongoModule

    ],
    declarations: [GetAllOptionRoute, GetOneOptionRoute, PostCreateOptionRoute, PutUpdateOptionRoute, DeleteOneOptionRoute,
        GetOneNoteRoute, PostCreateNoteRoute, OptionModel, NoteModel],
    providers: [
        HttpServerService,
        OptionService,
        { provide: OptionDocumentService, useFactory: optionDocumentFactory, deps: [MongoClientService] },
        NoteService,
        { provide: NoteDocumentService, useFactory: noteDocumentFactory, deps: [MongoClientService] }
    ]
})
export class ApplicationModule implements OnStart, OnError {
    /**
     * Class constructor
     *
     * @param {HttpServerService} _httpServer wrapper for instance of original Hapi server
     * @param {LoggerService} _logger
     */
    constructor(private _httpServer: HttpServerService, private _logger: LoggerService) {}
    /**
     * On start process
     *
     * @return {void | Observable<any>}
     */
    onStart(): void | Observable<any> {
        this._logger.info(`< Application.bootstrap > Server started at: ${this._httpServer.instance().info.uri}`);
    }

    /**
     * On error process
     *
     * @param {Error} error
     * @param data
     *
     * @return {void | Observable<any>}
     */
    onError(error: Error, data?: any): void | Observable<any> {
        this._logger.error('A problem occurred during application\'s lifecycle');
    }
}
