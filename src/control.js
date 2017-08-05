import React from 'react';

export class Control extends React.Component
{
    constructor(props)
    {
        super(props);

        this.field = props.field;
        this.handle = {x: props.color.r, y: 0};
        this.drag_point = {x: null, y: null};

        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.onCircleMouseDown = this.onCircleMouseDown.bind(this);
        this.onCircleMouseMove = this.onCircleMouseMove.bind(this);
        this.onCircleMouseUp = this.onCircleMouseUp.bind(this);
        this.onHandleMouseDown = this.onHandleMouseDown.bind(this);
        this.onHandleMouseMove = this.onHandleMouseMove.bind(this);
        this.onHandleMouseUp = this.onHandleMouseUp.bind(this);
    }
    
    onDeleteClick(e)
    {
        this.field.removeColor(this.props.color);
    }
    
    onCircleMouseDown(e)
    {
        var color = this.props.color,
            rect = this.field.svgElement.getBoundingClientRect();
        
        this.drag_point.x = e.clientX - rect.left - color.x;
        this.drag_point.y = e.clientY - rect.top - color.y;
    
        this.field.svgElement.addEventListener('mousemove', this.onCircleMouseMove);
        document.addEventListener('mouseup', this.onCircleMouseUp);
        e.preventDefault();
    }
    
    onCircleMouseMove(e)
    {
        var color = this.props.color;
        
        color.x = e.offsetX - this.drag_point.x;
        color.y = e.offsetY - this.drag_point.y;
        this.field.updateColor(color);

        e.preventDefault();
    }

    onCircleMouseUp(e)
    {
        this.removeEvents();
    }

    onHandleMouseDown(e)
    {
        this.field.svgElement.addEventListener('mousemove', this.onHandleMouseMove);
        document.addEventListener('mouseup', this.onHandleMouseUp);
        e.preventDefault();
    }
    
    onHandleMouseMove(e)
    {
        var color = this.props.color,
            handle = this.handle,
            x, y, theta;
        
        x = e.offsetX - color.x;
        y = e.offsetY - color.y;
        color.r = Math.round(Math.max(25, Math.hypot(x, y)));
        this.field.updateColor(color);
        
        // be sure the handle sticks to the radius
        theta = Math.atan2(x, y);
        handle.x = color.r * Math.sin(theta);
        handle.y = color.r * Math.cos(theta);
        
        e.preventDefault();
    }

    onHandleMouseUp(e)
    {
        this.removeEvents();
    }

    removeEvents()
    {
        this.field.svgElement.removeEventListener('mousemove', this.onCircleMouseMove);
        this.field.svgElement.removeEventListener('mousemove', this.onHandleMouseMove);
        document.removeEventListener('mouseup', this.onCircleMouseUp);
        document.removeEventListener('mouseup', this.onHandleMouseUp);
    }

    render()
    {
        var color = this.props.color,
            handle = this.handle,
            translate = 'translate(' + color.x + 'px, ' + color.y + 'px)';
    
        return (
            <g style={{transform: translate}}>
            <circle
                onMouseDown={this.onCircleMouseDown}
                cx={0} cy={0} r={color.r - 1}
                style={{fill: 'transparent', mixBlendMode: 'difference', stroke: 'white', strokeWidth: 2, cursor: 'move'}}
                />
            <circle
                cx={0} cy={0} r={color.r}
                style={{pointerEvents: 'none', fill: 'transparent', stroke: 'black', strokeWidth: 4, strokeDasharray: '7 4'}}
                />
            <circle
                cx={0} cy={0} r="5"
                style={{fill: 'white', stroke: 'black', strokeWidth: 2, cursor: 'pointer'}}
                />
            <circle
                onMouseDown={this.onHandleMouseDown}
                cx={0 + handle.x} cy={0 + handle.y} r="5"
                style={{fill: 'white', stroke: 'black', strokeWidth: 2, cursor: 'pointer'}}
                />
            <g id="X" style={{cursor: 'pointer'}} onClick={this.onDeleteClick}>
                <circle transform="translate(-13.8173901, -13.81439)" id="Oval" stroke="#000000" strokeWidth="2" fill="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" cx="13.8173901" cy="13.81439" r="12.89739"></circle>
                <path transform="translate(-13.8173901, -13.81439)" d="M13.814225,12.414342 L9.58949399,8.18975256 C9.20286846,7.80313999 8.57603513,7.80315049 8.18942256,8.18977601 C7.80280999,8.57640154 7.80282049,9.20323487 8.18944601,9.58984744 L12.4141301,13.81439 L8.18944601,18.0389326 C7.80282049,18.4255451 7.80280999,19.0523785 8.18942256,19.439004 C8.57603513,19.8256295 9.20286846,19.82564 9.58949399,19.4390274 L13.814225,15.214438 L18.039286,19.4393574 C18.4259115,19.82597 19.0527449,19.8259595 19.4393574,19.439334 C19.82597,19.0527085 19.8259595,18.4258751 19.439334,18.0392626 L15.2143199,13.81439 L19.439334,9.58951744 C19.8259595,9.20290487 19.82597,8.57607154 19.4393574,8.18944601 C19.0527449,7.80282049 18.4259115,7.80280999 18.039286,8.18942256 L13.814225,12.414342 Z" fill="#000000" fillRule="nonzero"></path>
            </g>
            </g>
            )
    }
}
