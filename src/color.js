import Chroma from 'chroma-js'

export class Fill
{
    constructor()
    {
        var chroma = Chroma.apply(null, arguments);
        this.rgb_r = chroma.get('rgb.r');
        this.rgb_g = chroma.get('rgb.g');
        this.rgb_b = chroma.get('rgb.b');
        this.lab_l = chroma.get('lab.l');
        this.lab_a = chroma.get('lab.a');
        this.lab_b = chroma.get('lab.b');
    }
    
    copy()
    {
        var fill_copy = new Fill('black');
        Object.assign(fill_copy, this);
        return fill_copy;
    }
    
    hex()
    {
        return Chroma(this.rgb()).hex();
    }
    
    rgb()
    {
        return [this.rgb_r, this.rgb_g, this.rgb_b];
    }
    
    lab()
    {
        return [this.lab_l, this.lab_a, this.lab_b];
    }
    
    get(channel)
    {
        var property = channel.replace('.', '_');
        
        return this[property];
    }
    
    set(channel, value)
    {
        var property = channel.replace('.', '_'),
            space = channel.slice(0, 3),
            fill_copy = this.copy(),
            chroma;
        
        fill_copy[property] = parseFloat(value);
        
        if(space === 'rgb') {
            chroma = Chroma(this.rgb_r, this.rgb_g, this.rgb_b, 'rgb');
        } else if(space === 'lab') {
            chroma = Chroma(this.lab_l, this.lab_a, this.lab_b, 'lab');
        } else {
            throw Error('Unknown space: ' + space);
        }
        
        if(space !== 'rgb') {
            fill_copy.rgb_r = chroma.get('rgb.r');
            fill_copy.rgb_g = chroma.get('rgb.g');
            fill_copy.rgb_b = chroma.get('rgb.b');
        }
        
        if(space !== 'lab') {
            fill_copy.lab_l = chroma.get('lab.l');
            fill_copy.lab_a = chroma.get('lab.a');
            fill_copy.lab_b = chroma.get('lab.b');
        }
        
        return fill_copy;
    }
}
