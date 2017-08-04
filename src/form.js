import React from 'react';

export class Form extends React.Component
{
    constructor(props)
    {
        super(props);

        this.field = props.field;
        this.onClick = this.onClick.bind(this);
    }

    onClick(event)
    {
        var color = Object.assign({}, this.props.color);
        color.fill = color.fill.set(event.target.name, event.target.checked ? 255 : 0);
        this.field.updateColor(color);
    }

    render()
    {
        var rgb = this.props.color.fill.rgb(),
            red = (rgb[0] >= 128),
            green = (rgb[1] >= 128),
            blue = (rgb[2] >= 128);
    
        return (
            <li>
            <form>
                <input type="checkbox" name="rgb.r" checked={red} onChange={this.onClick} /> Red
                <input type="checkbox" name="rgb.g" checked={green} onChange={this.onClick} /> Green
                <input type="checkbox" name="rgb.b" checked={blue} onChange={this.onClick} /> Blue
            </form>
            </li>
            )
    }
}
