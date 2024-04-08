const parseCookies = (cookies, unsignCookie) => {
  const unsignedCookie = {}

  for (const name in cookies) {
    const cookie = unsignCookie(cookies[name])
    if (!cookie.valid) throw new Error("Cookie isn't valid")
    unsignedCookie[name] = cookie.value
  }

  return unsignedCookie
}

export default parseCookies
