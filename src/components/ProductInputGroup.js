import { Combobox } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { API, graphqlOperation } from 'aws-amplify'
import React, { useEffect, useState } from 'react'
import { listProductsWithExtraInfo } from '../graphql/custom-queries'

// Only keeping truthy values, filtering out nulls and undefined
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// TODO: sort products before user filters?
const ProductInputGroup = ({ value, onChange, department = {} }) => {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState([])

  const filteredProducts =
    query === ''
      ? products
      : products
          .filter((product) => {
            return (
              product.name.toLowerCase().includes(query.toLowerCase()) ||
              product.department.name
                .toLowerCase()
                .includes(query.toLowerCase()) ||
              product.placement.toLowerCase().includes(query.toLowerCase())
            )
          })
          .sort((product1, product2) => product1.name - product2.name)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await API.graphql(
          graphqlOperation(listProductsWithExtraInfo, {
            filter: { departmentProductsId: { eq: department?.id } },
            limit: 500,
          })
        )
        const productsList = productsData.data.listProducts.items

        setProducts(productsList)
      } catch (err) {
        console.error('error fetching products', err)
      }
    }

    fetchProducts()
  }, [value, department])

  const handleChange = (productValue) => {
    onChange(productValue)
  }

  return (
    <Combobox as="div" value={value} onChange={handleChange}>
      <div className="relative mt-1 pb-4">
        <Combobox.Label className="block text-xs font-medium text-gray-900">
          Produkt
        </Combobox.Label>
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(product) => {
            return Object.keys(product).length !== 0
              ? `${product?.department?.name} - ${product?.name} - ${product?.placement}`
              : ''
          }}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filteredProducts.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredProducts.map((product) => (
              <Combobox.Option
                key={product.id}
                value={product}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-8 pr-4',
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames(
                        'block truncate',
                        selected && 'font-semibold'
                      )}
                    >
                      {product.department.name} - {product.name} -{' '}
                      {product.placement}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 left-0 flex items-center pl-1.5',
                          active ? 'text-white' : 'text-indigo-600'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  )
}

export default ProductInputGroup