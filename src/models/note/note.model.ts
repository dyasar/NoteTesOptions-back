import { Model, MongoClientService, MongoModel } from '@hapiness/mongo';
import { Config } from '@hapiness/config';

@MongoModel({
    adapter: 'mongoose',
    collection: 'notes',
    options: Config.get('mongodb')
})
export class NoteModel extends Model {
    // property to store schema
    readonly schema: any;

    /**
     * Class constructor
     *
     * @param {MongoClientService} _mongoClientService
     */
    constructor(private _mongoClientService: MongoClientService) {
        // call parent constructor
        super(NoteModel);

        // get dao
        const dao = this._mongoClientService.getDao(this.connectionOptions);

        // create schema
        this.schema = new dao.Schema({
            option_id: {
                type: String,
                required: true
            },
            commentaire: String,
            note_prof: {
                type: Number,
                required: true
            },
            note_option: {
                type: Number,
                required: true
            },
            note_compréhension: {
                type: Number,
                required: true
            },
            note_difficulté_examen: {
                type: Number,
                required: true
            }
            }, {
            versionKey: false
        });

        // implement virtual method toJSON to delete _id field
        this.schema.set('toJSON', {
                virtuals: true,
                transform: function (doc, ret) {
                    delete ret._id;
                    return ret;
                }
            }
        );
    }
}
