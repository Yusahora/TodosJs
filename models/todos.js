/*
// NOM        : OLLIVIER--DROLSHAGEN Félix, BLANCHET Noémie
// DESCRIPTIF : Trello bis -> Créer et supprimer des taches et des utilisateurs à volontés
// DATE       : 05/01/2019 
*/


//Variables
const db = require('sqlite')
const _ = require('lodash')


//Fonctions
module.exports = {
  //Fonction pour sélectionner les taches
  getAll() {
    return db.all("SELECT rowid AS id, * FROM todos")
  },
  //Fonction pour trouver les taches à faire
  find(id) {
    return db.get("SELECT rowid AS id, * FROM todos WHERE rowid = ?", id)
  },
  //Fonction pour supprimer les taches
  delete(id) {
    return db.run("DELETE FROM todos WHERE rowid = ?", id)
  },
  //Fonction pour creer une tache
  async create(params) {
    params[2] = parseInt(params[2])
    const data = _.values(params)

    const { lastID } = await db.run("INSERT INTO todos VALUES(?, ?, date('now'), date('now'), ?)", data)

    return this.find(lastID)
  },
  //Fonction pour mettre à jours une tache
  async update(params) {
    let string = ''

    for (k in params) {
      if (k !== 'id') {
        string += k + ' = ?,'
      }
    }

    const data = _.values(params)
    const { changes } = await db.run("UPDATE todos SET " + string + " updatedAt = date('now') WHERE rowid = ?", data)
    
    if (changes !== 0) {
      return this.find(params.id)
    } else {
      return Promise.reject({ message: 'Could not find id' })
    }
  },
}


