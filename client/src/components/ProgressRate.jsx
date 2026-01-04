import React from 'react'

const ProgressRate = () => {
    return (
        <div className='flex flex-col gap-3 items-center justify-center'>
            <div className='bg-[#4775ff] border-[3px] border-[#8fffec] flex justify-center items-center w-[160px] h-[160px] rounded-full'>
                <div className='bg-[#eaeaea] border-[3px] border-[#8fffec] flex justify-center items-center w-[110px] h-[110px] rounded-full'>
                    <h4 className='text-gray-500 text-2xl text-center font-semibold'>45%</h4>
                </div>
            </div>
            <div><p className='text-center font-semibold text-[#808080]'>Today's progress</p></div>
        </div>
    )
}

export default ProgressRate
