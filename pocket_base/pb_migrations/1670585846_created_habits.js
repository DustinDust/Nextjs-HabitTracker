migrate((db) => {
  const collection = new Collection({
    "id": "br9otuh8nz3xzzh",
    "created": "2022-12-09 11:37:26.030Z",
    "updated": "2022-12-09 11:37:26.030Z",
    "name": "habits",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "dxjextn1",
        "name": "habit_name",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "pbhny1ng",
        "name": "user",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "collectionId": "_pb_users_auth_",
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
  const collection = dao.findCollectionByNameOrId("br9otuh8nz3xzzh");

  return dao.deleteCollection(collection);
})
