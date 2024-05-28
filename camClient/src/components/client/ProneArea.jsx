import React from 'react'

export default function ProneArea({ totalCasesPerBrgy }) {
    const proneArea = totalCasesPerBrgy.filter(data => data.total_cases > 300)
    return (
        <div className='flex gap-2 items-center'>
            <div className='flex gap-3 items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-exclamation-triangle-fill text-yellow-500" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                </svg>

            </div>
            <div className='flex '>
                <p className=''>
                    Residents are advised to exercise increased caution as the following barangays have experienced a higher incidence of reported crimes: 
                    {
                        proneArea.map(data => (
                            <span className='font-semibold text-lg'> {data.barangay}, ({data.total_cases} cases) </span>
                        ))
                    }
                </p>
            </div>

        </div>
    )
}
