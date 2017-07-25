import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Chroma from 'chroma-js'

console.log(Chroma);

function Color(props)
{
    return (
        <circle
            onClick={() => props.field.onClick(props.color)}
            cx={props.color.x} cy={props.color.y} r={props.color.r}
            style={{fill: props.color.fill}}
            />
        )
}

class Field extends React.Component
{
    constructor()
    {
        super();
        this.state = {
            colors: [
                {fill: Chroma('#f0f'), x: 160, y: 160, r: 80},
                {fill: Chroma('#ff0'), x: 120, y: 120, r: 100}
            ]
        };
    }
    
    onClick()
    {
        console.log(arguments)
    }

    render()
    {
        var colors = this.state.colors.slice();

        // smallest circles should appear in front
        colors.sort(function(c1, c2) { return c2.r - c1.r });

        // build an array of Color components
        for(var i = 0; i < colors.length; i++)
        {
            colors[i] = <Color key={i} field={this} color={colors[i]} />
        }
    
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="650" height="400" style={{backgroundColor: '#f90'}}>
                {colors}
            </svg>
        );
    }
}

// ========================================

ReactDOM.render(
  <Field />,
  document.getElementById('root')
);

