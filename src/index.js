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
        this.state = this.loadState();

        this.onClickedBackground = this.onClickedBackground.bind(this);
        this.onRendered = this.onRendered.bind(this);
        this.saveState = this.saveState.bind(this);
        this.svgElement = null;
        this.timeout = null;
        this.form_index = 0;
    }
    
    loadState()
    {
        // a default state
        var state = {
            colors: [ ],
            active: null,
            stack: [ ],
            index: 0
        };

        try {
            var ascii = window.location.hash.replace('#', ''),
                bytes = new Buffer(ascii, 'base64'),
                json = zlib.inflateSync(bytes).toString(),
                loaded = JSON.parse(json);
        
            for(var i = 0; i < loaded.colors.length; i++)
            {
                loaded.colors[i].fill = Chroma(loaded.colors[i].fill);
                state.colors.push(loaded.colors[i]);
            }
            
            state.index = loaded.index || loaded.colors.length;

        } catch(e) {
            // some lame default colors
            state.colors = [
                {id: 0, fill: Chroma('#f0f'), x: 160, y: 160, r: 80},
                {id: 1, fill: Chroma('#ff0'), x: 120, y: 120, r: 100}
                ];
            state.index = 2;
        }
        
        return state;
    }
    
    saveState()
    {
        var state = { colors: [], index: this.state.index };
        
        for(var i = 0, color; i < this.state.colors.length; i++)
        {
            color = this.state.colors[i];
            state.colors.push({id: color.id, fill: color.fill.hex(), x: color.x, y: color.y, r: color.r});
        }
        
        var bytes = zlib.deflateSync(JSON.stringify(state), {level: 9}),
            ascii = bytes.toString('base64');
        
        window.location.hash = ascii;
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
        
        /*
        for(var i = stack.length - 1; i >= 0; i--)
        {
            if(stack[i] === color.id) { stack.splice(i, 1) }
        }
        */
        
        for(var index, i = 0; i < this.state.colors.length; i++)
        {
            if(this.state.colors[i].id === color.id) { index = i }
        }
        
        stack.unshift(index);
        stack.splice(3);
        
        this.setState({stack: stack, active: index});
    }
    
    updateColor(color)
    {
        var colors = this.state.colors.slice();
        
        for(var i = 0; i < colors.length; i++)
        {
            if(colors[i].id === color.id)
            {
                colors[i] = color;
            }
        }
        
        this.setState({colors: colors});
    }

    render()
    {
        var colors = this.state.colors.slice(),
            forms = [],
            control = null,
            key, color;
    
        // smallest circles should appear in front
        colors.sort(function(c1, c2) { return c2.r - c1.r });

        // build an array of Color components
        for(var i = 0; i < colors.length; i++)
        {
            colors[i] = <Color key={i} field={this} color={colors[i]} />
        }
        
        // render a stack of forms
        for(var j = 0; j < this.state.stack.length; j++)
        {
            key = 'form-' + this.form_index++;
            color = this.state.colors[this.state.stack[j]];
            forms.push(<Form key={key} field={this} color={color} />)
        }
        
        // show control for the active color
        if(this.state.active != undefined)
        {
            key = 'control-' + this.form_index++;
            color = this.state.colors[this.state.active];
            control = <Control key={key} field={this} color={color} />;
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

