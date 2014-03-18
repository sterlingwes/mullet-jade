var _ = require('underscore')
  , Jade = require('jade');

/*
 * JadeRenderer
 * 
 * - cfg, object has
 *      - templateFile: string path to jade template
 *      - template: string of jade to render
 *      - options: jade configuration options
 *      - data: template data
 */
function JadeRenderer(cfg) {
    if(typeof cfg !== 'object')
        return console.error('  ! JadeRenderer: no cfg object provided');

    _.extend(this, cfg);

    this.headscripts = [];
    this.footscripts = [];
};

/*
 * JadeRenderer.addData() - augment data before rendering
 */
JadeRenderer.prototype.addData = function(moreData) {
    this.data = this.data || {};
    _.extend(this.data, moreData);
};

/*
 * JadeRenderer.addReact() - adds a React component as an object that returns HTML rendered server-side and initialization hooks
 * 
 * - name, string: must match the name of the variable you'd like passed to the Jade compiler
 * - component, instance of ReactRenderer
 */
JadeRenderer.prototype.addReact = function(name, component) {

    if(typeof name !== 'string') {
        component = name;
        name = component.name;
    }
    this.data[name] = component.render();

    this.injectScript(
        'if(AppComponents["'+ name +'"]) React.renderComponent(AppComponents["'+ name +'"]('
                + JSON.stringify(component.data ||{}) +', '
                +'document.querySelector("#'+ name +'"));');
    
    return this;
};

/*
 * JadeRenderer.injectScript() - queues script to add to HTML on render()
 * 
 * - script, string to add
 * - inHead, boolean: if true, appends script to doc head, otherwise to body
 */
JadeRenderer.prototype.injectScript = function(script, inHead) {
    this[ ( inHead ? 'head' : 'foot' ) + 'scripts' ].push( script );
};

/*
 * JadeRenderer.render() - render and return HTML
 */
JadeRenderer.prototype.render = function() {

    var html = '<html><head></head><body></body></html>'; // lame!

    if(this.templateFile) {
        html = Jade.renderFile( this.templateFile, _.extend( {}, this.options || {}, this.data || {}) );
    }

    if(this.footscripts.length) {
        var scripts = '<script>'+this.footscripts.join('</script><script>')+'</script>';
        html.replace('</body>', scripts+'</body>');
    }

    if(this.headscripts.length) {
        var scripts = '<script>'+this.headscripts.join('</script><script>')+'</script>';
        html.replace('</head>', '<script>'+scripts+'</script></head>');
    }

    return html;

};

module.exports = {
    Renderer:   JadeRenderer
};