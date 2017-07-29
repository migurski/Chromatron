import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Chroma from 'chroma-js'
import zlib from 'zlib'
import {Control} from './control.js'
import {Form} from './form.js'

function Color(props)
{
    return (
        <circle
            onClick={() => props.field.onClickedColor(props.color)}
            cx={props.color.x} cy={props.color.y} r={props.color.r}
            style={{fill: props.color.fill.hex()}}
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
                {i: 0, fill: Chroma('#f0f'), x: 160, y: 160, r: 80},
                {i: 1, fill: Chroma('#ff0'), x: 120, y: 120, r: 100}
            ],
            active: null,
            stack: [ ]
        };

        this.onClickedBackground = this.onClickedBackground.bind(this);
        this.onRendered = this.onRendered.bind(this);
        this.saveState = this.saveState.bind(this);
        this.svgElement = null;
        this.timeout = null;
        this.index = 0;
    }
    
    saveState()
    {
        var state = { colors: [] };
        
        for(var i = 0, color; i < this.state.colors.length; i++)
        {
            color = this.state.colors[i];
            state.colors.push({i: color.i, fill: color.fill.hex(), x: color.x, y: color.y, r: color.r});
        }
        
        console.log(JSON.stringify(state).length, 'chars JSON');
        
        var bytes = zlib.deflateSync(JSON.stringify(state), {level: 9}),
            ascii = bytes.toString('base64'),
            hash = window.encodeURIComponent(ascii);
        
        console.log(bytes.length, 'bytes zlib');
        console.log(ascii.length, 'chars base64');
        console.log(hash.length, 'chars hash');
        
        window.location.hash = hash;
    }
    
    onRendered(svg)
    {
        this.svgElement = svg;
    }
    
    onClickedBackground()
    {
        this.setState({active: null});
    }
    
    onClickedColor(color)
    {
        var stack = this.state.stack.slice();
        
        if(color !== stack[0])
        {
            stack.unshift(color);
            stack.splice(3);
        }

        this.setState({stack: stack, active: color});
    }
    
    updateColor(color)
    {
        var colors = this.state.colors.slice();
        
        /*
        for(var i = 0; i < colors.length; i++)
        {
            if(colors[i] === color)
            {
                colors[i] = color;
            }
        }
        */
        
        this.setState({colors: colors});
    }

    render()
    {
        var colors = this.state.colors.slice(),
            forms = [],
            control = null;
    
        // smallest circles should appear in front
        colors.sort(function(c1, c2) { return c2.r - c1.r });

        // build an array of Color components
        for(var i = 0; i < colors.length; i++)
        {
            colors[i] = <Color key={i} field={this} color={colors[i]} />
        }
        
        // render a stack of forms
        for(var j = 0, color; j < this.state.stack.length; j++)
        {
            color = this.state.stack[j];
            forms.push(<Form key={'form-' + this.index++} field={this} color={color} />)
        }
        
        // show control for the active color
        if(this.state.active)
        {
            var key = 'control-' + this.state.active.i;
            control = <Control key={key} field={this} color={this.state.active} />;
        }
        
        return (
            <div>
              <svg ref={this.onRendered} xmlns="http://www.w3.org/2000/svg" width="650" height="400">
                <rect width="100%" height="100%" onClick={this.onClickedBackground} style={{fill: '#f90'}} />
                {colors}
                {control}
              </svg>
              <ol>
                {forms}
              </ol>
            </div>
        );
    }
    
    componentDidUpdate()
    {
        window.clearTimeout(this.timeout);
        this.timeout = window.setTimeout(this.saveState, 500);
    }
}

// ========================================

ReactDOM.render(
  <Field />,
  document.getElementById('root')
);

