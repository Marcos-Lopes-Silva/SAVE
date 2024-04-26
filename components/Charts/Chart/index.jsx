import { useState } from 'react';
import { AreaChart, LineChart, BarChart, PieChart, ComposedChart, RadarChart, PolarGrid, CartesianGrid, Tooltip, Radar, Bar, Legend, XAxis, YAxis, Line, Area, PolarAngleAxis, Pie, PolarRadiusAxis, Text, LabelList, Cell, ResponsiveContainer } from 'recharts';
import renderActiveShape from './CustomLabelPie';
import CustomizedTick from './Customized Tick';


const Chart = ({ type, data, height, width, dataKey, dataKey2, dataKey3, dataKey4 }) => {

    console.log(dataKey2)
    const [label, setLabel] = useState(true);
    const [state, setState] = useState({ activeIndex: null });


    const COLORS = ['#00BFFF', '#B0C4DE', '#2E8B57', '#6B8E23', '#808000', '#BC8F8F', '#D2B48C', '#DA70D6'];

    function needAngle(data, i) {
        let j = i;
        if (data.length > 4) return true;
        else if (data.length < 3) return false;
        else if (j == data.length ? false : data[j].name.length > 50 ? true : needAngle(data, ++j)) return true;
        else return false;
    }

    let renderLabel = (entry) => {
        return entry.name;
    }

    const onPieOut = () => {
        setLabel(true);
        setState({
            activeIndex: null,
        });
    }

    const onPieEnter = (_, index) => {
        setLabel(false);
        setState({
            activeIndex: index,
        });
    };

    const charts = [{
        id: 'bar',
        chart: (index) => (
            <ResponsiveContainer key={index} width='100%' height='100%'>
                <BarChart key={index} data={data} margin={{ bottom: 5, top: 20 }}  >
                    <XAxis dataKey='name' height={150} padding={{ left: 20, right: 20 }} dx={data.length > 5 ? 20 : 0} dy={data.length > 5 ? 40 : 5} interval={0} fontSize={12} tick={<CustomizedTick Angle={needAngle(data, 0)} />} />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 4" />
                    <Tooltip />
                    {dataKey === 'value' ? null : <Legend fontSize={5} width={90} rotate={90} />}
                    <Bar dataKey={dataKey} barSize={40} fill={COLORS[Math.floor(Math.random() * 8)]}><LabelList dataKey={dataKey} position="top" /></Bar>
                    {dataKey2 ? <Bar dataKey={dataKey2} barSize={40} fill={COLORS[Math.floor(Math.random() * 8)]}><LabelList dataKey={dataKey2} position="top" /></Bar> : null}
                </BarChart>
            </ResponsiveContainer>

        )
    },
    {
        id: 'mixbarchart',
        chart: (index) => (
            <ResponsiveContainer key={index} width="100%" height="100%">
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={'value'} stackId="a" fill="#8884d8" />
                    <Bar dataKey={'value'} stackId="a" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        )
    },
    {
        id: 'line',
        chart: (index) => (
            <ResponsiveContainer key={index} width='100%' height='100%'>
                <LineChart width={width} height={height} data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey={dataKey} stroke="#ff572a" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey={dataKey2} stroke="#f91b9b" />
                </LineChart>
            </ResponsiveContainer>
        )
    },
    {
        id: 'area',
        chart: (index) => (
            <AreaChart key={index} width={width} height={height} data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                <Area type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
            </AreaChart>
        )
    },
    {
        id: 'pie',
        chart: (index) => (

            <ResponsiveContainer key={index} width='100%' height='90%'>
                <PieChart>
                    <Legend align='middle' verticalAlign='bottom' />
                    <Pie label={label} paddingAngle={2} onMouseLeave={onPieOut} onMouseEnter={onPieEnter} activeIndex={state.activeIndex} activeShape={renderActiveShape} data={data} dataKey="value" nameKey='name' cx="50%" cy="50%" innerRadius={120} outerRadius={150} fill="#82ca9d">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

        )
    },
    {
        id: 'composed',
        chart: (index) => (
            <ComposedChart key={index} width={width} height={height} data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid stroke="#f5f5f5" />
                <Area type="monotone" dataKey={dataKey} fill="#8884d8" stroke="#8884d8" />
                <Bar dataKey="pv" barSize={20} fill="#413ea0" />
                <Line type="monotone" dataKey={dataKey2} stroke="#ff7300" />
            </ComposedChart>
        )
    },
    {
        id: 'radar',
        chart: (index) => (
            <ResponsiveContainer key={index} width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis />
                    <Radar name={dataKey3} dataKey={'value'} stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </RadarChart>
            </ResponsiveContainer>
        )
    }]



    return (
        <>
            {charts.map((chart, index) => chart.id === type ? chart.chart(index) : null)}
        </>
    )
};

export default Chart;