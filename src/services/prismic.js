import Prismic from '@prismicio/client'

import { PRISMIC_ENDPOINT, PRISMIC_ACCESS_TOKEN } from '../../prismicSecret'

export function getPrismicClient(req) {
  const prismic = Prismic.client(PRISMIC_ENDPOINT, {
    req,
    accessToken: PRISMIC_ACCESS_TOKEN
  })

  return prismic
}
