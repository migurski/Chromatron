import React from 'react';

export class Control extends React.Component
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
        var color = this.state.color;
        
        color.x = e.offsetX;
        color.y = e.offsetY;
        this.field.updateColor(color);
        this.setState({color: color});
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
        var color = this.state.color,
            handle = this.state.handle;
        
        handle.x = e.offsetX - color.x;
        handle.y = e.offsetY - color.y;
        color.r = Math.round(Math.hypot(handle.x, handle.y));
        this.field.updateColor(color);
        this.setState({color: color, handle: handle});
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
