import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Chroma from 'chroma-js'

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

class Control extends React.Component
{
    constructor(props)
    {
        super(props);

        this.field = props.field;
        this.state = {
            color: props.color,
            handle: {x: props.color.r, y: 0}
            };

        this.onCenterMouseDown = this.onCenterMouseDown.bind(this);
        this.onCenterMouseMove = this.onCenterMouseMove.bind(this);
        this.onCenterMouseUp = this.onCenterMouseUp.bind(this);
        this.onHandleMouseDown = this.onHandleMouseDown.bind(this);
        this.onHandleMouseMove = this.onHandleMouseMove.bind(this);
        this.onHandleMouseUp = this.onHandleMouseUp.bind(this);
    }
    
    onCenterMouseDown(e)
    {
        this.field.svgElement.addEventListener('mousemove', this.onCenterMouseMove);
        document.addEventListener('mouseup', this.onCenterMouseUp);
    }
    
    onCenterMouseMove(e)
    {
        var state = {
            color: this.state.color,
            handle: this.state.handle
            };
        
        state.color.x = e.offsetX;
        state.color.y = e.offsetY;
        this.field.updateColor(state.color);
        this.setState(state);
    }

    onCenterMouseUp(e)
    {
        this.removeEvents();
    }

    onHandleMouseDown(e)
    {
        this.field.svgElement.addEventListener('mousemove', this.onHandleMouseMove);
        document.addEventListener('mouseup', this.onHandleMouseUp);
    }
    
    onHandleMouseMove(e)
    {
        var state = {
            color: this.state.color,
            handle: this.state.handle
            };
        
        state.handle.x = e.offsetX - state.color.x;
        state.handle.y = e.offsetY - state.color.y;
        state.color.r = Math.hypot(state.handle.x, state.handle.y);
        this.field.updateColor(state.color);
        this.setState(state);
    }

    onHandleMouseUp(e)
    {
        this.removeEvents();
    }

    removeEvents()
    {
        this.field.svgElement.removeEventListener('mousemove', this.onCenterMouseMove);
        this.field.svgElement.removeEventListener('mousemove', this.onHandleMouseMove);
        document.removeEventListener('mouseup', this.onCenterMouseUp);
        document.removeEventListener('mouseup', this.onHandleMouseUp);
    }

    render()
    {
        var color = this.state.color,
            handle = this.state.handle;
    
        return (
            <g>
            <circle
                cx={color.x} cy={color.y} r={color.r - 1}
                style={{pointerEvents: 'none', fill: 'transparent', mixBlendMode: 'difference', stroke: 'white', strokeWidth: 2}}
                />
            <circle
                cx={color.x} cy={color.y} r={color.r}
                style={{pointerEvents: 'none', fill: 'transparent', stroke: 'black', strokeWidth: 4, strokeDasharray: '7 4'}}
                />
            <circle
                onMouseDown={this.onCenterMouseDown}
                cx={color.x} cy={color.y} r="5"
                style={{fill: 'white', stroke: 'black', strokeWidth: 2, cursor: 'pointer'}}
                />
            <circle
                onMouseDown={this.onHandleMouseDown}
                cx={color.x + handle.x} cy={color.y + handle.y} r="5"
                style={{fill: 'white', stroke: 'black', strokeWidth: 2, cursor: 'pointer'}}
                />
            </g>
            )
    }
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
            active: null,
            stack: [ ],
            index: 0
        };

        this.onClickedBackground = this.onClickedBackground.bind(this);
        this.onRendered = this.onRendered.bind(this);
        this.svgElement = null;
    }
    
    onRendered(svg)
    {
        this.svgElement = svg;
    }
    
    onClickedBackground()
    {
        var state = {
            colors: this.state.colors.slice(),
            active: null,
            stack: this.state.stack.slice(),
            index: this.state.index
        };

        this.setState(state);
    }
    
    onClickedColor(color)
    {
        var state = {
            colors: this.state.colors.slice(),
            active: color,
            stack: this.state.stack.slice(),
            index: this.state.index
        };
        
        if(color !== state.stack[0])
        {
            state.stack.unshift(color);
            state.stack.splice(3);
        }

        this.setState(state);
    }
    
    updateColor(color)
    {
        var state = {
            colors: this.state.colors.slice(),
            active: this.state.active,
            stack: this.state.stack.slice(),
            index: this.state.index
        };
        
        for(var i = 0; i < state.colors.length; i++)
        {
            if(state.colors[i] === color)
            {
                state.colors[i] = color;
            }
        }
        
        this.setState(state);
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
        for(var j = 0; j < this.state.stack.length; j++)
        {
            forms.push(<Form key={'form-' + this.state.index++} field={this} color={this.state.stack[j]} />)
        }
        
        // show control for the active color
        if(this.state.active)
        {
            var key = 'control-' + this.state.colors.indexOf(this.state.active);
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
}

// ========================================

ReactDOM.render(
  <Field />,
  document.getElementById('root')
);

