/*
// NOM        : OLLIVIER--DROLSHAGEN Félix, BLANCHET Noémie
// DESCRIPTIF : Trello bis -> Créer et supprimer des taches et des utilisateurs à volontés
// DATE       : 05/01/2019 
*/


const db = require('sqlite')
const _ = require('lodash')

module.exports = {
//Fonction pour avoir tous les todos d'un utilisateur
  async getAllTodosForUserId(userId) {
    userId = parseInt(userId) 
    if(!userId){
      return Promise.reject({ message: 'Could not find id' })
    }
    return db.all("SELECT rowid AS id, * FROM todos WHERE userId = ?", userId)
  },
//Fonction pour récup les user
  getAllUsers() {
    return db.all("SELECT rowid AS id, * FROM users")
  },
  //Fonction pour récup les userId
  getAllUserIds() {
    return db.all("SELECT rowid AS id FROM users")
  },
  //Fonction pour récup un utilisateur
  findOneUser(id) {
    return db.get("SELECT rowid AS id, * FROM users WHERE rowid = ?", id)
  },
  //Fonction pour créé un user
  async createUser(params) {
    const data = _.values(params)

    const { lastID } = await db.run("INSERT INTO users VALUES(?, ?, ?, ?, ?, date('now'), date('now'))", data)

    return this.findOneUser(lastID)
  },
  //Fonction pour ajouter un user
  deleteUser(id) {
    return db.run("DELETE FROM users WHERE rowid = ?", id)
  },
  //Fonction pour modifier un user
  async updateUser(params) {
    let string = ''

    for (k in params) {
      if (k !== 'id') {
        string += k + ' = ?,'
      }
    }
    
    const data = _.values(params)
    const { changes } = await db.run("UPDATE users SET " + string + " updatedAt = date('now') WHERE rowid = ?", data)
    
    if (changes !== 0) {
      return this.findOneUser(params.id)
    } else {
      return Promise.reject({ message: 'Could not find id' })
    }
  },
}


