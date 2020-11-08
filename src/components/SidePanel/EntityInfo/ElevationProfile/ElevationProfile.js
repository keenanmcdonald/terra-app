import React from 'react'
import {ScatterChart, ResponsiveContainer, Scatter, XAxis, YAxis} from 'recharts'
import TerraContext from '../../../../TerraContext'

class ElevationProfile extends React.Component{
    static contextType = TerraContext

    componentDidMount(){
        this.parseData(this.props.positions)
    }

    parseData(){
        const data = []
        let totalDistance = 0
        let maxHeight = 0
        let minHeight = 30000
        for (let i = 0; i < this.props.positions.length; i++){
            maxHeight = this.props.positions[i].height*3.28084 > maxHeight ? this.props.positions[i].height*3.28084 : maxHeight
            minHeight = this.props.positions[i].height*3.28084 < minHeight ? this.props.positions[i].height*3.28084 : minHeight
            totalDistance += i === 0 ? 0 : this.context.methods.calculateLegDistance(this.props.positions[i], this.props.positions[i-1])
            data.push({elevation: (this.props.positions[i].height * 3.28084), distance: totalDistance})
        }
        minHeight = Math.floor(minHeight*.01)*100
        maxHeight = Math.ceil(maxHeight*.01)*100
        return {data, minHeight, maxHeight}
    }

    render(){
        const {data, minHeight, maxHeight} = this.parseData()

        return (
            <div className='elevation-profile-container'>
                {data.length ? (
                <ResponsiveContainer width="95%" height={150}>
                    <ScatterChart  margin={{top: 20,left: -20}}>
                        <Scatter name="elevation" data={data} fill="#FFFFFF" line={true}/>
                        <XAxis tick={{fontSize: 8}} dataKey='distance' type='number' allowDecimals={false} unit='mi' name='distance' domain={[0, Math.ceil(data[data.length-1].distance)]} stroke="#FFFFFF"/>
                        <YAxis tick={{fontSize: 8}} dataKey='elevation' type='number' name='elevation' unit='ft' domain={[minHeight, maxHeight]} stroke="#FFFFFF"/>
                    </ScatterChart>
                 </ResponsiveContainer>
                ): ''}
            </div>
        )
    }
}

export default ElevationProfile