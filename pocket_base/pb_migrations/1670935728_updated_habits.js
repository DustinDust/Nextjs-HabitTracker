migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("br9otuh8nz3xzzh")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "3kcismki",
    "name": "once",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("br9otuh8nz3xzzh")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "3kcismki",
    "name": "isCheckedField",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
})
