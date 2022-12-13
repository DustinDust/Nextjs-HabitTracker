migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("br9otuh8nz3xzzh")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "skrbhz4d",
    "name": "target",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": 86400
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("br9otuh8nz3xzzh")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "skrbhz4d",
    "name": "target",
    "type": "number",
    "required": true,
    "unique": false,
    "options": {
      "min": 0,
      "max": 86400
    }
  }))

  return dao.saveCollection(collection)
})
