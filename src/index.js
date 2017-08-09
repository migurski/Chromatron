import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import zlib from 'zlib'
import {Control} from './control.js'
import {Form} from './form.js'
import {Fill} from './color.js'

function Circle(props)
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

        this.setBackground = this.setBackground.bind(this);
        this.onClickedBackground = this.onClickedBackground.bind(this);
        this.onRendered = this.onRendered.bind(this);
        this.saveState = this.saveState.bind(this);
        this.addColor = this.addColor.bind(this);
        this.svgElement = null;
        this.timeout = null;
        this.form_index = 0;
    }
    
    loadState()
    {
        // a default state
        var state = {
            colors: [ ],
            active: -1,
            stack: [ ],
            index: 0,
            background: null
        };

        try {
            var ascii = window.location.hash.replace('#', ''),
                bytes = new Buffer(ascii, 'base64'),
                json = zlib.inflateSync(bytes).toString(),
                loaded = JSON.parse(json);
        
            for(var i = 0; i < loaded.colors.length; i++)
            {
                loaded.colors[i].fill = new Fill(loaded.colors[i].fill);
                state.colors.push(loaded.colors[i]);
            }
            
            state.background = new Fill(loaded.background || 'gray');
            state.index = loaded.index || loaded.colors.length;

        } catch(e) {
            // some lame default colors
            state.colors = [
                {id: 0, fill: new Fill('#f0f'), x: 160, y: 160, r: 80},
                {id: 1, fill: new Fill('#ff0'), x: 120, y: 120, r: 100}
                ];
            state.background = new Fill('gray');
            state.index = 2;
        }
        
        return state;
    }
    
    saveState()
    {
        var state = {
            colors: [ ],
            background: this.state.background.hex(),
            index: this.state.index
            };
        
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
    
    setBackground(event)
    {
        this.setState({background: new Fill(event.target.value)});
        event.preventDefault();
    }
    
    onClickedBackground()
    {
        this.setState({active: -1});
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
        stack.splice(2);
        
        this.setState({stack: stack, active: index});
    }
    
    addColor(event)
    {
        var rect = event.target.getBoundingClientRect(),
            radius = Math.floor(rect.right/2 - rect.left/2),
            x = Math.floor(rect.left + radius),
            y = Math.floor(rect.bottom + radius + 10);
        
        var color = {id: this.state.index++, fill: new Fill('#f90'), x: x, y: y, r: radius},
            colors = this.state.colors.slice();
        
        colors.push(color);
        this.setState({colors: colors, index: this.state.index});
        
        var stack = this.state.stack.slice(),
            index = colors.indexOf(color);

        stack.unshift(index);
        stack.splice(2);
        this.setState({stack: stack, active: index});

        event.preventDefault();
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
    
    removeColor(color)
    {
        var colors = this.state.colors.slice(),
            stack = this.state.stack.slice();
        
        for(var i = colors.length - 1; i >= 0; i--)
        {
            if(colors[i].id === color.id)
            {
                for(var j = stack.length - 1; j >= 0; j--)
                {
                    if(stack[j] === i) { stack.splice(j, 1) }
                }

                colors.splice(i, 1);
            }
        }
        
        this.setState({stack: stack, colors: colors, active: -1});
    }

    render()
    {
        var circles = this.state.colors.slice(),
            forms = [],
            control = null,
            key, color;
    
        // smallest circles should appear in front
        circles.sort(function(c1, c2) { return c2.r - c1.r });

        // swap in an array of Circle components
        for(var i = 0; i < circles.length; i++)
        {
            circles[i] = <Circle key={i} field={this} color={circles[i]} />
        }
        
        // render a stack of forms
        for(var j = 0; j < this.state.stack.length; j++)
        {
            color = this.state.colors[this.state.stack[j]];
            
            if(color)
            {
                forms.unshift(<Form key={'form-' + j} field={this} color={color} />)
            }
        }
        
        // show control for the active color
        if(this.state.active >= 0)
        {
            color = this.state.colors[this.state.active];
            key = 'control-' + color.id;
            control = <Control key={key} field={this} color={color} />;
        }
        
        var about_url = 'https://github.com/migurski/Chromatron',
            feedback_url = about_url + '/issues/new?title=I+have+an+idea&body=You+should+totally…';
        
        return (
            <div>
              <svg ref={this.onRendered} xmlns="http://www.w3.org/2000/svg" style={{
                position: 'fixed', left: 0, top: 0, width: '100%', height: '100%'
                }}>
                <rect width="100%" height="100%" onClick={this.onClickedBackground} style={{fill: this.state.background.hex()}} />
                {circles}
                {control}
              </svg>
              <div style={{position: 'fixed', top: 0, right: 0, height: '100%'}}>
                {forms}
              </div>
              <form style={{position: 'absolute', left: 15, top: 15}}>
                <button onClick={this.addColor} style={{
                    marginRight: 10,
                    backgroundColor: 'white', color: 'black',
                    border: '2px solid black', borderRadius: 6, cursor: 'pointer'
                    }}>+ Add Color</button>
                <a className="button" href={about_url} target="_blank" rel="noopener noreferrer" style={{
                    marginRight: 10,
                    backgroundColor: 'white',
                    border: '2px solid black', borderRadius: 6, cursor: 'pointer'
                    }}>About Chromatron</a>
                <a className="button" href={feedback_url} target="_blank" rel="noopener noreferrer" style={{
                    marginRight: 10,
                    backgroundColor: 'white',
                    border: '2px solid black', borderRadius: 6, cursor: 'pointer'
                    }}>Send Feedback</a>
                <button value='black' onClick={this.setBackground} style={{
                    marginRight: 10,
                    backgroundColor: 'black',
                    border: '2px solid gray', borderRadius: 6, cursor: 'pointer'
                    }}>&nbsp;&nbsp;</button>
                <button value='gray' onClick={this.setBackground} style={{
                    marginRight: 10,
                    backgroundColor: 'gray',
                    border: '2px solid white', borderRadius: 6, cursor: 'pointer'
                    }}>&nbsp;&nbsp;</button>
                <button value='white' onClick={this.setBackground} style={{
                    marginRight: 10,
                    backgroundColor: 'white',
                    border: '2px solid gray', borderRadius: 6, cursor: 'pointer'
                    }}>&nbsp;&nbsp;</button>
              </form>
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

