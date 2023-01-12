migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s9hiw1g26on54fp")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dlrw1sw3",
    "name": "habit",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "collectionId": "br9otuh8nz3xzzh",
      "cascadeDelete": true
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s9hiw1g26on54fp")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dlrw1sw3",
    "name": "habit",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "collectionId": "br9otuh8nz3xzzh",
      "cascadeDelete": false
    }
  }))

  return dao.saveCollection(collection)
})
