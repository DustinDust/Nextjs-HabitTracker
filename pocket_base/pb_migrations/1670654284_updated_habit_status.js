migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s9hiw1g26on54fp")

  collection.listRule = "@request.auth.id = @collection.habits.user.id"
  collection.viewRule = "@request.auth.id = @collection.habits.user.id"
  collection.createRule = "@request.auth.id = @collection.habits.user.id"
  collection.deleteRule = "@request.auth.id = @collection.habits.user.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s9hiw1g26on54fp")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
