import React, { Fragment, useEffect, useState } from 'react'
import AddButton from '../../../components/AddButton'
import DepartmentInputGroup from '../departments/DepartmentInputGroup'
import AddPlanSlideover from './AddPlanSlideover'
import Plans from './Plans'

const PlansLayout = () => {
  const [openAddSlider, setOpenAddSlider] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState({})

  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department)
  }

  let plansToDraw
  if (
    selectedDepartment !== undefined &&
    Object.keys(selectedDepartment).length > 0
  ) {
    plansToDraw = (
      <Fragment>
        <Plans department={selectedDepartment} />
      </Fragment>
    )
  }

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center mt-6 ml-5 mr-5">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Ritningar</h1>
            <p className="mt-2 text-sm text-gray-700">
              Välj avdelning i listan nedan för att visa ritningar som tillhör
              avdelningen.
            </p>
          </div>
          <AddButton openSlider={setOpenAddSlider} />
        </div>
        <div className="px-5 mb-4 mt-4">
          <DepartmentInputGroup
            value={selectedDepartment}
            onChange={handleDepartmentChange}
          />
        </div>
        <div className="p-5">{plansToDraw}</div>
        {openAddSlider && (
          <AddPlanSlideover open={openAddSlider} setOpen={setOpenAddSlider} />
        )}
      </div>
    </>
  )
}

export default PlansLayout
