import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export function StatChart() {
    const data = [
        {
            day: 'Monday',
            hours: 4
        },
        {
            day: 'Tuesday',
            hours: 2
        },
        {
            day: 'Wednesday',
            hours: 3
        },
        {
            day: 'Thursday',
            hours: 5
        },
        {
            day: 'Friday',
            hours: 2
        },
        {
            day: 'Saturday',
            hours: 3
        },
        {
            day: 'Sunday',
            hours: 4
        }
    ]

    return(
        <ResponsiveContainer width='50%' height='100%'>
            <BarChart 
                data={data}
            >
                <XAxis dataKey="day" />
                <YAxis />
                <Legend />
                <Tooltip />
                <Bar dataKey='hours' fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    ) 
}