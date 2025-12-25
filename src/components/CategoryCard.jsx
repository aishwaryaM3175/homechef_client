import React from 'react'

function CategoryCard({name,image,onClick}) {
  return (
   
      <div
  className='w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-full border-2 border-white shrink-0 overflow-hidden bg-white shadow-xl shadow-gray-200 hover:shadow-lg transition-shadow relative cursor-pointer'
  onClick={onClick}
>

     <img src={image} alt="" className=' w-full h-full object-cover transform hover:scale-110 transition-transform duration-300'/>
     
      <div className='absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#ffffffd9] px-3 py-1 rounded-full text-center shadow text-xs font-medium text-gray-800 backdrop-blur'>

{name}
     </div>
    </div>
  )
}

export default CategoryCard
