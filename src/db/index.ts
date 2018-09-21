import * as nedb from 'nedb'
import { resolve } from "path";

const collections = {}

const filename = (collection) => resolve(process.cwd(), `./data/${collection}.db`);

export const crud = {
  find: (collection) => new Promise((resolve, reject) =>
    collections[collection]
      .find({})
      .exec((err, res) =>
        err ? reject(err) : resolve(res))
  ),
  findOne: (collection, _id) => new Promise((resolve, reject) =>
    collections[collection]
      .findOne({_id}, (err, res) =>
        err ? reject(err) : resolve(res))
  ),
  create: (collection, document) => new Promise((resolve, reject) =>
    collections[collection].insert(document, (err, res) =>
      err ? reject(err) : resolve(res))
  ),
  update: (collection, _id, document) =>
    new Promise((resolve, reject) =>
      collections[collection].update({_id}, document, {}, (err, res) =>
        err ? reject(err) : resolve(res === 1)
      )),
  delete: (collection, _id) =>
    new Promise((resolve, reject) =>
      collections[collection].remove({_id}, (err, res) =>
        err ? reject(err) : resolve(res === 1)
      ))
}


/** Define your collections here **/

// The name of the collection and file
export const itemCollection = 'items';

// Define the nedb instance
collections[itemCollection] = new nedb({
  filename: filename(itemCollection),
  autoload: true,
})

// Configure the collection
collections[itemCollection]
  .ensureIndex({fieldName: 'name', unique: true}, (e) => e ? console.error(e) : null);

// Export the API you like to use in your app
export const items = {
  find: () => crud.find(itemCollection),
  findOne: (_id) => crud.findOne(itemCollection, _id),
  create: (document) => crud.create(itemCollection, document),
  update: (_id, document) => crud.update(itemCollection, _id, document),
  delete: (_id) => crud.delete(itemCollection, _id),
}
