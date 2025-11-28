export function useTelegram() {
  const tg = window.Telegram.WebApp

  const init = () => {
    if (!tg) return
    tg.ready()
    tg.expand()
  }

  const openLink = (url) => {
    tg.openLink(url)
  }

  return {
    tg,
    init,
    user: tg?.initDataUnsafe?.user,
    openLink,
  }
}
