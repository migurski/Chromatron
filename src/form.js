import React from 'react';

export class Form extends React.Component
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
