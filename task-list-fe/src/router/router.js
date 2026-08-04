import { useCallback, useEffect, useState } from 'react'

function currentLocation() {
  return {
    pathname: window.location.pathname,
    search: window.location.search,
  }
}

function notifyRouteChange() {
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function useRouter() {
  const [location, setLocation] = useState(() => currentLocation())

  useEffect(() => {
    function handleLocationChange() {
      setLocation(currentLocation())
    }

    window.addEventListener('popstate', handleLocationChange)

    return () => window.removeEventListener('popstate', handleLocationChange)
  }, [])

  const navigate = useCallback((to, { replace = false } = {}) => {
    if (replace) {
      window.history.replaceState(null, '', to)
    } else {
      window.history.pushState(null, '', to)
    }

    notifyRouteChange()
  }, [])

  return {
    location,
    navigate,
  }
}
