import React from 'react'

const GridElement = ({data}) => {
  return (
    <div className='grid-element blue-border'>
        <div className="name">Name</div>
        <br />
        <div className="copypass">
            <button>Copy Password</button>
        </div>
        <div className="show-details">
            <button>Show Details</button>
        </div>
    </div>
  )
}

export default GridElement