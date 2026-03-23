import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import '../styles/globals.css'

const NO_LAYOUT_ROUTES = ['/']

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const withoutLayout = NO_LAYOUT_ROUTES.includes(router.pathname)

  if (withoutLayout) {
    return <Component {...pageProps} />
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
