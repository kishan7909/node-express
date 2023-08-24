const { Model } = require('objection')
const knex = require('../db/knex')
const { v4: uuidv4 } = require('uuid');
const Interviews = require('./Interviews');
// const Interviews = require('./Interviews');
Model.knex(knex);

class Clients extends Model {
    static get tableName() {
        return 'clients';
    }
    static get relationMappings() {
        const ClientFeedBack = require('./ClientFeedBack');
        const Industries = require('./Industries');
        const User = require('./User');
        return {
            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'clients.userId',
                    to: 'users.id'
                }
            },
            industries: {
                relation: Model.BelongsToOneRelation,
                modelClass: Industries,
                join: {
                    from: 'clients.industriesId',
                    to: 'industries.id'
                }
            },
            clientFeedback: {
                relation: Model.HasOneRelation,
                modelClass: ClientFeedBack,
                join: {
                    from: "clients.id",
                    to: 'clientFeedback.onBoardingId'
                }
            },
            interviews: {
                relation: Model.HasManyRelation,
                modelClass: Interviews,
                join: {
                    from: "clients.id",
                    to: 'interviews.onBoardingId'
                }
            },
        }
    }
    $beforeInsert(context) {
        this.id = uuidv4()
    }
}

module.exports = Clients