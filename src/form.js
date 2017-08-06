import React from 'react';

export function Range(props)
{
    var button_style = {
        background: 'none', border: 'none', fontSize: 16, lineHeight: '17px',
        verticalAlign: 'top', width: 21, height: 13, paddingLeft: 2,
        paddingTop: 0, paddingRight: 2, paddingBottom: 0
        };

    return (
        <p style={{height: 20, margin: 0, lineHeight: '19px', whiteSpace: 'nowrap'}} title={props.title}>
            <label htmlFor={props.name} style={{
                width: 40,
                display: 'block',
                float: 'left'
                }}>{props.label}: {props.value}</label>

            <button onClick={props.form.onButton}
                name={props.name} value={-props.step} style={button_style}>&#9664;</button>
            
            <input onChange={props.form.onSlider} type="range" name={props.name}
                value={props.value} min={props.min} max={props.max} step={props.step}
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
            rgb = fill.rgb(), lab = fill.lab(), lch = fill.lch(), hsl = fill.hsl();
    
        return (
            <form style={{display: 'block', float: 'right', width: 180, height: '100%', padding: 18, background: 'rgba(255,255,255,.8)'}}>
                <div style={{height: 50, background: fill.hex()}} />
                    <h3>RGB</h3>
                    <Range key="rgb.r" name="rgb.r" label="R" value={rgb[0]} min="0" max="255" step="1" title="Red" form={form} />
                    <Range key="rgb.g" name="rgb.g" label="G" value={rgb[1]} min="0" max="255" step="1" title="Green" form={form} />
                    <Range key="rgb.b" name="rgb.b" label="B" value={rgb[2]} min="0" max="255" step="1" title="Blue" form={form} />
                    <h3>Lch</h3>
                    <Range key="lch.l" name="lch.l" label="L" value={lch[0].toFixed(1)} min="0" max="100" step=".3" title="Lightness" form={form} />
                    <Range key="lch.c" name="lch.c" label="c" value={lch[1].toFixed(1)} min="0" max="140" step=".2" title="Chroma" form={form} />
                    <Range key="lch.h" name="lch.h" label="h" value={lch[2].toFixed(0)} min="0" max="360" step="1" title="Hue" form={form} />
                    <h3>Lab</h3>
                    <Range key="lab.l" name="lab.l" label="L" value={lab[0].toFixed(1)} min="0" max="100" step=".3" title="Lightness" form={form} />
                    <Range key="lab.a" name="lab.a" label="a" value={lab[1].toFixed(1)} min="-110" max="110" step=".4" title="Color a" form={form} />
                    <Range key="lab.b" name="lab.b" label="b" value={lab[2].toFixed(1)} min="-110" max="110" step=".4" title="Color b" form={form} />
                    <h3>HSL</h3>
                    <Range key="hsl.h" name="hsl.h" label="H" value={hsl[0].toFixed(0)} min="0" max="360" step="1" title="Hue" form={form} />
                    <Range key="hsl.s" name="hsl.s" label="S" value={hsl[1].toFixed(3)} min="0" max="1" step=".005" title="Saturation" form={form} />
                    <Range key="hsl.l" name="hsl.l" label="L" value={hsl[2].toFixed(3)} min="0" max="1" step=".005" title="Lightness" form={form} />
            </form>
            )
    }
}
