import React from 'react';

export function Range(props)
{
    var button_style = {
        background: 'none', border: 'none', fontSize: 16, lineHeight: '17px',
        verticalAlign: 'top', width: 21, height: 13, paddingLeft: 2,
        paddingTop: 0, paddingRight: 2, paddingBottom: 0
        };

    return (
        <p style={{height: 20, margin: 0, lineHeight: '19px', whiteSpace: 'nowrap'}}>
            <label htmlFor={props.name} style={{
                width: 40,
                display: 'block',
                float: 'left'
                }}>{props.label}: {props.value}</label>

            <button onClick={props.form.onButton}
                name={props.name} value={-props.step} style={button_style}>&#9664;</button>
            
            <input onChange={props.form.onSlider} type="range" name={props.name}
                value={props.value} min={props.min} max={props.max}
                style={{width: 100, height: 9, margin: 0}} />
            
            <button onClick={props.form.onButton}
                name={props.name} value={props.step} style={button_style}>&#9654;</button>
        </p>
        )
}

export class Form extends React.Component
{
    constructor(props)
    {
        super(props);

        this.field = props.field;
        this.onClick = this.onClick.bind(this);
        this.onSlider = this.onSlider.bind(this);
        this.onButton = this.onButton.bind(this);
    }

    onClick(event)
    {
        var color = Object.assign({}, this.props.color);
        color.fill = color.fill.set(event.target.name, event.target.checked ? 255 : 0);
        this.field.updateColor(color);
    }
    
    onSlider(event)
    {
        var color = Object.assign({}, this.props.color);
        color.fill = color.fill.set(event.target.name, event.target.value);
        this.field.updateColor(color);
        event.preventDefault();
    }
    
    onButton(event)
    {
        var color = Object.assign({}, this.props.color),
            value = color.fill.get(event.target.name),
            delta = parseFloat(event.target.value);

        color.fill = color.fill.set(event.target.name, value + delta);
        this.field.updateColor(color);
        event.preventDefault();
    }

    render()
    {
        var form = this,
            fill = this.props.color.fill,
            rgb = fill.rgb();
    
        return (
            <form style={{display: 'block', float: 'right', width: 180, height: '100%', padding: 18, background: 'rgba(255,255,255,.8)'}}>
                <div style={{height: 50, background: fill.hex()}} />
                    <h3>RGB</h3>
                    <Range key="rgb.r" name="rgb.r" label="R" value={rgb[0]} min="0" max="255" step="1" form={form} />
                    <Range key="rgb.g" name="rgb.g" label="G" value={rgb[1]} min="0" max="255" step="1" form={form} />
                    <Range key="rgb.b" name="rgb.b" label="B" value={rgb[2]} min="0" max="255" step="1" form={form} />
            </form>
            )
    }
}
