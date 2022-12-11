migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("br9otuh8nz3xzzh")

  collection.listRule = "@request.auth.id = @collection.habits.user.id"
  collection.viewRule = "@request.auth.id = @collection.habits.user.id"
  collection.createRule = "@request.auth.id = @collection.habits.user.id"
  collection.updateRule = "@request.auth.id = @collection.habits.user.id"
  collection.deleteRule = "@request.auth.id = @collection.habits.user.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("br9otuh8nz3xzzh")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
