migrate((db) => {
  const collection = new Collection({
    "id": "s9hiw1g26on54fp",
    "created": "2022-12-10 06:12:55.980Z",
    "updated": "2022-12-10 06:12:55.980Z",
    "name": "habit_status",
    "type": "base",
    "system": false,
    "schema": [
      {
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
      }
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("s9hiw1g26on54fp");

  return dao.deleteCollection(collection);
})
