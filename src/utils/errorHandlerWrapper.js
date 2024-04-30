export const errorHandlerWrapper = (callback) => {
  try {
    callback()
  } catch (e) {
    console.log(e)
  }
}
export const asyncErrorHandlerWrapper = async (callback) => {
  try {
    await callback()
  } catch (e) {
    console.log(e)
  }
}
