/*
 * # Jade
 * 
 * Handles rendering jade templates and passing through init data to clientside engines (React)
 * 
 * @exports {Object} Renderer a JadeRenderer instance for assembling templates and data
 * @exports {Function} render passthru to Jade engine for strings
 * @exports {Function} renderFile passthru to Jade engine for .jade files
 * 
 */

var _ = require('underscore')
  , Jade = require('jade');

/*
 * ## JadeRenderer.constructor
 * 
 * @param {Object} cfg may have the following
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
 * ## JadeRenderer.addData() 
 * 
 * Augment data before rendering
 * 
 * @param {Object} moreData
 */
JadeRenderer.prototype.addData = function(moreData) {
    this.data = this.data || {};
    _.extend(this.data, moreData);
};

/*
 * ## JadeRenderer.addReact()
 * 
 * Adds a React component as an object and preps component HTML and initialization hooks
 * 
 * @param {String} name (optional) of React component to match the variable you'd like passed to the Jade template, otherwise uses the name of the `component` param
 * @param {Object} component as an instance of ReactRenderer
 * @return {Object} itself for chaining
 */
JadeRenderer.prototype.addReact = function(name, component) {

    if(typeof name !== 'string') {
        component = name;
        name = component.name;
    }
    this.data[name] = component.render();

    this.injectScript(
        'if(window.AppComponents["'+ name +'"]) React.renderComponent(window.AppComponents["'+ name +'"]('
                + JSON.stringify(component.data ||{}) +'), '
                +'document.querySelector("#'+ name +'"));');
    return this;
};

/*
 * ## JadeRenderer.injectScript() 
 * 
 * Queues script to add to HTML on render()
 * 
 * @param {String} script to add
 * @param {Boolean} inHead if true, appends script to doc head, otherwise to body
 */
JadeRenderer.prototype.injectScript = function(script, inHead) {
    this[ ( inHead ? 'head' : 'foot' ) + 'scripts' ].push( script );
};

/*
 * ## JadeRenderer.render() 
 * 
 * Render and return HTML
 * 
 * @return {String} html
 */
JadeRenderer.prototype.render = function() {

    var html = '<html><head></head><body></body></html>'; // lame!

    if(this.templateFile) {
        html = Jade.renderFile( this.templateFile, _.extend( {}, this.options || {}, this.data || {}) );
    }

    if(this.footscripts.length) {
        var ftscripts = '<script>'+this.footscripts.join('</script><script>')+'</script>';
        html = html.replace('</body>', ftscripts+'</body>');
    }

    if(this.headscripts.length) {
        var hdscripts = '<script>'+this.headscripts.join('</script><script>')+'</script>';
        html = html.replace('</head>', '<script>'+hdscripts+'</script></head>');
    }

    return html;

};

module.exports = {
    Renderer:   JadeRenderer,
    
    render:     Jade.render,
    renderFile: Jade.renderFile
};