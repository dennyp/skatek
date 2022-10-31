import { Fragment, useEffect, useState } from 'react'

import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { API, graphqlOperation } from 'aws-amplify'
import { toast } from 'react-toastify'
import { updateProduct } from '../../graphql/mutations'
import { getProduct } from '../../graphql/queries'
import DepartmentInputGroup from '../DepartmentInputGroup'
import ProductLocationInputGroup from '../ProductLocationInputGroup'
import ProductTypeInputGroup from '../ProductTypeInputGroup'
import TextInputGroup from '../TextInputGroup'

const initialState = {
  name: '',
  department: {},
  productType: {},
  placement: '',
  location: {},
}

const ProductSlideover = ({ open, setOpen, productId, onSave }) => {
  const [product, setProduct] = useState(initialState)
  const [isChanged, setIsChanged] = useState(false)

  const noChangeMessage = () => toast.warn('Ingen ändring att spara')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await API.graphql(
          graphqlOperation(getProduct, { id: productId })
        )
        const product = productData.data.getProduct
        setProduct(product)
      } catch (err) {
        console.error('error fetching product')
      }
    }

    fetchProduct()
  }, [productId])

  const handleClose = () => {
    setOpen(false)
  }

  const handleDepartmentChange = (department) => {
    setProduct({ ...product, department })
    setIsChanged(true)
  }

  const handleNameChange = (name) => {
    setProduct({ ...product, name })
    setIsChanged(true)
  }

  const handleProductTypeChange = (productType) => {
    setProduct({ ...product, productType })
    setIsChanged(true)
  }

  const handlePlacementChange = (placement) => {
    setProduct({ ...product, placement })
    setIsChanged(true)
  }

  const handleLocationChange = (location) => {
    setProduct({ ...product, location })
    setIsChanged(true)
  }

  const handleSave = async (event) => {
    try {
      if (!isChanged) {
        noChangeMessage()
        return
      }

      const data = await API.graphql(
        graphqlOperation(updateProduct, {
          input: {
            id: product.id,
            name: product.name,
            placement: product.placement,
            departmentProductsId: product.department.id,
            productProductTypeId: product.productType.id,
            productLocationId: product.location.id,
          },
        })
      )

      setIsChanged(false)
      onSave(product)
      setProduct({})

      handleClose()
    } catch (err) {
      console.error('error saving product', err)
    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            {' '}
                            Ändra produkt{' '}
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              onClick={handleClose}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <DepartmentInputGroup
                          value={product.department}
                          onChange={handleDepartmentChange}
                        />
                        <TextInputGroup
                          label="Märke"
                          value={product.name}
                          onChange={handleNameChange}
                        />
                        <TextInputGroup
                          label="Placering"
                          value={product.placement}
                          onChange={handlePlacementChange}
                        />
                        <ProductTypeInputGroup
                          value={product.productType}
                          onChange={handleProductTypeChange}
                        />
                        <ProductLocationInputGroup
                          label="Invändig/utvändig"
                          value={product.location}
                          onChange={handleLocationChange}
                        />
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={handleClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default ProductSlideover
