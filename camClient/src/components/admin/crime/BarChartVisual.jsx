import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import CustomTooltip from './CustomTooltip2';
// import "./style.css";


export default function BarChartVisual({ totalCasesPerBrgy, showTooltip, setTooltip, selected, setSelected }) {
    const formattedData = [];

    totalCasesPerBrgy.forEach(entry => {
        const { barangay, total_cases, offense, count_per_barangay } = entry;

        // Check if the barangay already exists in the formattedData array
        const existingBarangay = formattedData.find(item => item.barangay === barangay);

        if (existingBarangay) {
            // Barangay exists, add the offense details
            existingBarangay.offenses.push({ offense, count_per_barangay });
        } else {
            // Barangay doesn't exist, create a new entry
            formattedData.push({
                barangay,
                total_cases,
                offenses: [{ offense, count_per_barangay }],
            });
        }
    });
    return (
        <>
            <BarChart width={800} height={350} data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} className='text-xs'>

                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="barangay" tick={{ fontSize: 14 }} label={{ value: '', position: 'insideBottom', fontSize: 16 }} angle={-15} textAnchor="end" interval={0} />
                <YAxis dataKey="total_cases" domain={[0, 700]} />
                <Tooltip content={<CustomTooltip active={showTooltip} payload={formattedData}  className='overflow-auto'/>} className='overflow-auto' />
                {/* <Legend /> */}
                <Bar dataKey="total_cases" fill="#bf9b30" />
            </BarChart>
        </>

    )
}