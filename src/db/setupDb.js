const actions = [
  { name: 'Повітряна загроза', isActive: 0 },
  { name: 'Радіаційна загроза', isActive: 0 },
  { name: 'Хімічна загроза', isActive: 0 },
]

const setupDb = (handlers) => {
  const { Action } = handlers

  const allActions = Action.select()

  if (allActions.length !== actions.length) {
    Action.deleteAll()
    for (const action of actions) {
      const { isActive, name } = action
      Action.create({ name, isActive })
    }
  }
}

export default setupDb