migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("br9otuh8nz3xzzh")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "3kcismki",
    "name": "isCheckield",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  // add
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "glbnfaju",
    "name": "cron",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": "(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\\d+(ns|us|µs|ms|s|m|h))+)|((((\\d+,)+\\d+|(\\d+(\\/|-)\\d+)|\\d+|\\*) ?){5,7})"
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("br9otuh8nz3xzzh")

  // remove
  collection.schema.removeField("3kcismki")

  // remove
  collection.schema.removeField("skrbhz4d")

  // remove
  collection.schema.removeField("glbnfaju")

  return dao.saveCollection(collection)
})
