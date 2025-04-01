import React from 'react'

function ProgressTracker() {
  return (
    <div className="lessonTracker d-flex flex-column text-white rounded-4 p-3">
    <div className="basicTracker rounded-4 m-2 mb-4">
      <div className="basicTitle fs-1 text-center mb-3">Basic</div>
      <div className="basic1tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
        Lesson 1 <span>50%</span>
      </div>
      <div className="basic2tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
        Lesson 2 <span>0%</span>
      </div>
      <div className="basic3tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
        Lesson 3 <span>0%</span>
      </div>
      <div className="basic4tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
        Lesson 4 <span>0%</span>
      </div>
    </div>
    <div className="intermediateTracker rounded-4 m-2 mb-4">
      <div className="interTitle text-center mb-3">Intermediate</div>
      <div className="inter1tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
        Lesson 1 <span>50%</span>
      </div>
      <div className="inter2tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
        Lesson 2 <span>20%</span>
      </div>
      <div className="inter3tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
        Lesson 3 <span>0%</span>
      </div>
      <div className="inter4tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
        Lesson 4 <span>0%</span>
      </div>
    </div>
    <div className="advancedTracker rounded-4 m-2 mb-4">
      <div className="advancedTitle  text-center mb-3">Advanced</div>
      <div className="advanced1tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
        Lesson 1 <span>30%</span>
      </div>
      <div className="advanced2tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
        Lesson 2 <span>10%</span>
      </div>
      <div className="advanced3tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
        Lesson 3 <span>0%</span>
      </div>
      <div className="advanced4tracker d-flex ms-3 mb-3 rounded-4 p-2 justify-content-between">
        Lesson 4 <span>0%</span>
      </div>
    </div>
  </div>
  )
}

export default ProgressTracker    