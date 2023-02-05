import { Fragment, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'
import DepartmentInputGroup from '../../../components/DepartmentInputGroup'
import ProductLocationInputGroup from '../../../components/ProductLocationInputGroup'
import ProductTypeInputGroup from '../../../components/ProductTypeInputGroup'
import TextInputGroup from '../../../components/TextInputGroup'
import { fetchProductById, updateProduct } from './productSlice'

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

  const dispatch = useDispatch()

  const noChangeMessage = () => toast.warn('Ingen ändring att spara')

  useEffect(() => {
    try {
      const fetchProduct = async () => {
        const product = await dispatch(fetchProductById(productId)).unwrap()
        setProduct(product)
      }

      fetchProduct()
    } catch (err) {
      console.error('error fetching product')
    }
  }, [dispatch, productId])

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

      const response = await dispatch(updateProduct(product)).unwrap()

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
                        Avbryt
                      </button>
                      <button
                        type="submit"
                        className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={handleSave}
                      >
                        Spara
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