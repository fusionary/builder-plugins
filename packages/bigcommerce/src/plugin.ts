import type { CommerceAPIOperations, Resource } from '@builder.io/plugin-tools'
import type { ClientOptions, FetchResponse } from 'openapi-fetch'
import { registerCommercePlugin } from '@builder.io/plugin-tools'
import createClient from 'openapi-fetch'

// eslint-disable-next-line import/extensions
import type { paths as productsCatalogV3 } from './types/products_catalog.v3'

type ProductResponse = NonNullable<
  NonNullable<
    FetchResponse<
      productsCatalogV3['/catalog/products']['get'],
      object,
      'application/json'
    >['data']
  >['data']
>[number]

const buildUrl = (endUrl: string) =>
  `https://cdn.builder.io/api/v1/proxy-api?url=${encodeURIComponent(endUrl)}`

const createBigCommerceProductCatalogClient = (
  storeHash: string,
  accessToken: string,
) => {
  const baseUrl = `https://api.bigcommerce.com/stores/${storeHash}`
  const clientOptions: ClientOptions = {
    headers: {
      Accept: 'application/json',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'X-Auth-Token': accessToken,
    },
  }

  const client = createClient<productsCatalogV3>({
    baseUrl: `${baseUrl}/v3`,
    ...clientOptions,
  })

  client.use({
    onRequest(req) {
      const proxiedUrl = buildUrl(req.url)
      return new Request(proxiedUrl, req)
    },
  })

  return client
}

registerCommercePlugin(
  {
    ctaText: `Connect your Fusionary BigCommerce store`,
    // should always match package.json package name
    id: '@fusionary/bigcommerce-plugin',
    name: 'Fusionary BigCommerce',
    settings: [
      {
        name: 'storeHash',
        required: true,
        type: 'string',
      },
      {
        name: 'accessToken',
        required: true,
        type: 'string',
      },
      {
        name: 'brandId',
        type: 'number',
      },
    ],
  },
  settings => {
    /* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
    const storeHash = `${settings.get('storeHash') ?? ''}`.trim()
    const accessToken = `${settings.get('accessToken') ?? ''}`.trim()
    const brandIdTmp = settings.get('brandId') as unknown
    /* eslint-enable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
    const brandId = typeof brandIdTmp === 'number' ? brandIdTmp : undefined

    const transformProduct = (product: ProductResponse): Resource => ({
      ...product,
      handle: product.sku!,
      id: `${product.id}`,
      title: product.name!,
      ...(product.images?.[0]?.url_standard && {
        image: {
          src: product.images[0].url_standard,
        },
      }),
    })

    const service: CommerceAPIOperations = {
      product: {
        async findByHandle(handle: string) {
          const client = createBigCommerceProductCatalogClient(
            storeHash,
            accessToken,
          )
          const products = await client.GET('/catalog/products', {
            params: {
              header: {
                Accept: 'application/json',
              },
              query: {
                sku: handle,
              },
            },
          })

          if (products.data?.data?.length !== 1) {
            throw new Error(`Cannot find product ${handle}`)
          }

          return transformProduct(products.data.data[0]!)
        },

        async findById(id: string) {
          const client = createBigCommerceProductCatalogClient(
            storeHash,
            accessToken,
          )
          const product = await client.GET('/catalog/products/{product_id}', {
            params: {
              header: {
                Accept: 'application/json',
              },
              path: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                product_id: parseInt(id, 10),
              },
            },
          })

          if (!product.data?.data) {
            throw new Error(`Cannot find product ${id}`)
          }

          return transformProduct(product.data.data)
        },

        getRequestObject(id: string, resource: Resource) {
          return {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            '@type': '@builder.io/core:Request' as const,
            options: {
              handle: resource.handle!,
              product: id,
            },
            request: {
              query: {
                sku: resource.handle!,
              },
              url: buildUrl(
                `https://api.bigcommerce.com/stores/${storeHash}/v3/catalog/products/${id}`,
              ),
            },
          }
        },

        async search(search: string) {
          const client = createBigCommerceProductCatalogClient(
            storeHash,
            accessToken,
          )

          /* eslint-disable @typescript-eslint/naming-convention */
          const products = await client.GET('/catalog/products', {
            params: {
              header: {
                Accept: 'application/json',
              },
              query: {
                brand_id: brandId,
                is_visible: true,
                keyword: search,
              },
            },
          })
          /* eslint-enable @typescript-eslint/naming-convention */

          return products.data?.data?.map(transformProduct) ?? []
        },
      },
    } satisfies CommerceAPIOperations

    return service
  },
)
  // eslint-disable-next-line no-console
  .then(console.log)
  // eslint-disable-next-line no-console
  .catch(console.error)
