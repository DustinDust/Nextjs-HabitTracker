migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s9hiw1g26on54fp")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lkcr6j7j",
    "name": "date",
    "type": "date",
    "required": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vuklzzt6",
    "name": "time",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "7eqvgt7h",
    "name": "done",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s9hiw1g26on54fp")

  // remove
  collection.schema.removeField("lkcr6j7j")

  // remove
  collection.schema.removeField("vuklzzt6")

  // remove
  collection.schema.removeField("7eqvgt7h")

  return dao.saveCollection(collection)
})
