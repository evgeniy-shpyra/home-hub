const setupDb = (models) => {
  try {
    const Action = models.Action
    const Sensor = models.Sensor

    // create air alarm action
    const resultAlarmAction = Action.selectById(-1)
    if (!resultAlarmAction.success) {
      throw new Error("Can't select action for air alarm")
    }
    if (!resultAlarmAction.payload) {
      const resultInserting = Action.createWithId({
        id: -1,
        name: 'Повітряна тривога'
      })
      if (!resultInserting.success) {
        throw new Error("Can't insert action for air alarm")
      }
    }

    // create air alarm sensor
    const resultSensorSelecting = Sensor.getById(-1)
    if (!resultSensorSelecting.success) {
      throw new Error("Can't select sensor for air alarm")
    }
    if (!resultSensorSelecting.payload) {
      const resultInserting = Sensor.createWithId({
        id: -1,
        name: 'Повітряна тривога',
        actionId: -1
      })
      if (!resultInserting.success) {
        throw new Error("Can't insert sensor fro air alarm")
      }
    }
  } catch (e) {
    console.log(e)
    process.exit(-1)
  }
}

export default setupDb
