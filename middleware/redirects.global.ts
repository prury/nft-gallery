export default defineNuxtRouteMiddleware((route) => {
  const { urlPrefix } = usePrefix()

  let redirectValue

  const paths = [
    {
      cond: (val) => val === '/drops',
      replaceValue: '/ahp/drops',
    },
    {
      cond: (val) =>
        val.startsWith(`/${urlPrefix.value}`) && val.endsWith('collections'),
      replaceValue: () => `/${urlPrefix.value}/explore/collectibles`,
    },
    {
      cond: (val) =>
        val.startsWith(`/${urlPrefix.value}`) && val.endsWith('gallery'),
      replaceValue: () => `/${urlPrefix.value}/explore/items`,
    },
    {
      cond: (val) => val.includes('/stmn/'),
      replaceValue: () => window.location.href.replace('/stmn/', '/ahk/'),
    },
    {
      cond: (val) => val.includes('/rmrk2/'),
      replaceValue: () => window.location.href.replace('/rmrk2/', '/ksm/'),
    },
    {
      cond: (val) => val.startsWith('/transfer'),
      replaceValue: () =>
        window.location.href.replace('/transfer', '/ksm/transfer'),
    },
  ]

  for (const path of paths) {
    if (path.cond(route.path)) {
      redirectValue =
        typeof path.replaceValue === 'function'
          ? path.replaceValue()
          : path.replaceValue
      break
    }
  }

  if (redirectValue) {
    console.log(redirectValue)
    return navigateTo(redirectValue, { external: true })
  }
})
