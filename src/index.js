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
            style={{fill: props.color.fill.hex()}}
            />
        )
}

class Form extends React.Component
{
    constructor(props)
    {
        super(props);

        var rgb = props.color.fill.rgb(),
            red = (rgb[0] >= 128),
            green = (rgb[1] >= 128),
            blue = (rgb[2] >= 128);
    
        this.field = props.field;
        this.state = { red: red, green: green, blue: blue, color: props.color };
        this.onClick = this.onClick.bind(this);
    }

    onClick(event)
    {
        var color = this.state.color;
        color.fill = color.fill.set(event.target.name, event.target.checked ? 255 : 0);
        this.field.updateColor(color);
    }

    render()
    {
        return (
            <li>
            <form>
                <input type="checkbox" name="rgb.r" defaultChecked={this.state.red} onChange={this.onClick} /> Red
                <input type="checkbox" name="rgb.g" defaultChecked={this.state.green} onChange={this.onClick} /> Green
                <input type="checkbox" name="rgb.b" defaultChecked={this.state.blue} onChange={this.onClick} /> Blue
            </form>
            </li>
            )
    }
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
            ],
            active: [ ],
            index: 0
        };
    }
    
    onClick(color)
    {
        this.state.active.unshift(color);
        this.state.active.splice(3);
        this.setState(this.state);
    }
    
    updateColor(color)
    {
        for(var i = 0; i < this.state.colors.length; i++)
        {
            if(this.state.colors[i] === color)
            {
                console.log('Updated', i, color)
                this.state.colors[i] = color; // mutating anyway
            }
        }
        
        this.setState(this.state);
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
        
        var forms = [];
    
        for(var j = 0; j < this.state.active.length; j++)
        {
            forms.push(<Form key={this.state.index++} field={this} color={this.state.active[j]} />)
        }
        
        return (
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="650" height="400" style={{backgroundColor: '#f90'}}>
                {colors}
              </svg>
              <ol>
                {forms}
              </ol>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
  <Field />,
  document.getElementById('root')
);

