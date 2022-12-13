migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s9hiw1g26on54fp")

  collection.updateRule = "@request.auth.id = habit.user.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s9hiw1g26on54fp")

  collection.updateRule = null

  return dao.saveCollection(collection)
})
