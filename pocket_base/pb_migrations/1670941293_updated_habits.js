migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("br9otuh8nz3xzzh")

  // remove
  collection.schema.removeField("3kcismki")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("br9otuh8nz3xzzh")

  // add
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
})
