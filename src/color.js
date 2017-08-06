import Chroma from 'chroma-js'

export class Fill
{
    constructor()
    {
        var chroma = Chroma.apply(null, arguments);
        this.rgb_r = chroma.get('rgb.r');
        this.rgb_g = chroma.get('rgb.g');
        this.rgb_b = chroma.get('rgb.b');
        this.lch_l = chroma.get('lch.l');
        this.lch_c = chroma.get('lch.c');
        this.lch_h = chroma.get('lch.h');
        this.lab_l = chroma.get('lab.l');
        this.lab_a = chroma.get('lab.a');
        this.lab_b = chroma.get('lab.b');
        this.hsl_h = chroma.get('hsl.h');
        this.hsl_s = chroma.get('hsl.s');
        this.hsl_l = chroma.get('hsl.l');
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
    
    lch()
    {
        return [this.lch_l, this.lch_c, this.lch_h];
    }
    
    lab()
    {
        return [this.lab_l, this.lab_a, this.lab_b];
    }
    
    hsl()
    {
        return [this.hsl_h, this.hsl_s, this.hsl_l];
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
        } else if(space === 'lch') {
            chroma = Chroma(this.lch_l, this.lch_c, this.lch_h, 'lch');
        } else if(space === 'lab') {
            chroma = Chroma(this.lab_l, this.lab_a, this.lab_b, 'lab');
        } else if(space === 'hsl') {
            chroma = Chroma(this.hsl_h, this.hsl_s, this.hsl_l, 'hsl');
        } else {
            throw Error('Unknown space: ' + space);
        }
        
        if(space !== 'rgb') {
            fill_copy.rgb_r = chroma.get('rgb.r');
            fill_copy.rgb_g = chroma.get('rgb.g');
            fill_copy.rgb_b = chroma.get('rgb.b');
        }
        
        if(space !== 'lch') {
            fill_copy.lch_l = chroma.get('lch.l');
            fill_copy.lch_c = chroma.get('lch.c');
            fill_copy.lch_h = chroma.get('lch.h');
        }
        
        if(space !== 'lab') {
            fill_copy.lab_l = chroma.get('lab.l');
            fill_copy.lab_a = chroma.get('lab.a');
            fill_copy.lab_b = chroma.get('lab.b');
        }
        
        if(space !== 'hsl') {
            fill_copy.hsl_h = chroma.get('hsl.h');
            fill_copy.hsl_s = chroma.get('hsl.s');
            fill_copy.hsl_l = chroma.get('hsl.l');
        }
        
        return fill_copy;
    }
}
