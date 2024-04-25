export const queryWrapper = (callback) => {
  try {
    const result = callback()
    return { success: true, payload: result }
  } catch (e) {
    console.log(e)
    return { success: false, error: e.message }
  }
}
