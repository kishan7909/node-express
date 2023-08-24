const { Model } = require('objection')
const knex = require('../db/knex')
const { v4: uuidv4 } = require('uuid')

Model.knex(knex)

class Candidate extends Model {
  static get tableName() {
    return 'candidates'
  }
  //relationship
  static get relationMappings() {
    const User = require('./User')
    const Professional = require('./Professional')
    const Education = require('./Education')
    const Experience = require('./Experience')
    const Interviews = require('./Interviews')
    return {
      professional: {
        relation: Model.HasOneRelation,
        modelClass: Professional,
        join: {
          from: 'candidates.id',
          to: 'professional.candidateId',
        },
      },
      education: {
        relation: Model.HasManyRelation,
        modelClass: Education,
        join: {
          from: 'candidates.id',
          to: 'education.candidateId',
        },
      },
      experience: {
        relation: Model.HasManyRelation,
        modelClass: Experience,
        join: {
          from: 'candidates.id',
          to: 'experience.candidateId',
        },
      },
      interviews: {
          relation: Model.HasOneRelation,
          modelClass:Interviews,
          join: {
              from: "candidates.id",
              to: 'interviews.candidateId'
          }
      },
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
            from: 'candidates.userId',
            to: 'users.id'
        }
    },
    }
  }

  $beforeInsert(context) {
    this.id = uuidv4()
  }
}

module.exports = Candidate
