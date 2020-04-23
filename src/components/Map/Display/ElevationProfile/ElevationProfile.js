import React from 'react'
import {ScatterChart, Scatter, XAxis, YAxis} from 'recharts'
import TerraContext from '../../../../TerraContext'

class ElevationProfile extends React.Component{
    static contextType = TerraContext


    constructor(props){
        super(props)

        this.state = {
            data: []
        }
    }

    componentDidMount(){
        this.parseData()
    }

    parseData(){
        const data = []
        let totalDistance = 0
        for (let i = 0; i < this.props.positions.length; i++){
            totalDistance += i === 0 ? 0 : this.context.methods.calculateLegDistance(this.props.positions[i], this.props.positions[i-1])
            data.push({elevation: (this.props.positions[i].height * 3.28084), distance: totalDistance})
        }
        console.log(data)
        this.setState({data})
    }

    render(){
        return (
            <div className='elevation-profile-container'>
                <ScatterChart width={400} height={150} margin={{top: 20}}>
                    <Scatter name="elevation" data={this.state.data} fill="#FFFFFF" line={true}/>
                    <XAxis dataKey='distance'/>
                    <YAxis dataKey='elevation'/>
                </ScatterChart>
            </div>
        )
    }
}

export default ElevationProfile