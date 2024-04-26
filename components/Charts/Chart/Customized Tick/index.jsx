import { Text } from 'recharts';

export default function CustomizedTick(props) {
    const { x, y, stroke, payload, Angle } = props;


    payload.value = payload.value.length > 50 ? payload.value.substring(0, 35) + '...' : payload.value;
    
    if (Angle)
        return (
            <Text angle={30} x={x + 5} y={y + 10} width='120' dy={16} fill='#666' verticalAnchor='start' textAnchor='middle' style={{ fontSize: '11px' }} >
                {payload.value}
            </Text>

        );
    else return (
        <Text angle={0} x={x + 5} y={y + 10} width='120' dy={16} fill='#666' verticalAnchor='start' textAnchor='middle' style={{ fontSize: '11px' }} >
                {payload.value}
            </Text>
    )
}