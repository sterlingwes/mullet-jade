var Jade = require('../main.js').Renderer
  , ReactRenderer = require('../../react/main.js')
  , jade = new Jade({
      templateFile: __dirname + '/testtpl.jade',
      data: {}
  })
  , cdata = {hello:'world'}
  , react = new ReactRenderer('react', __dirname + '/test.jsx', cdata);

describe('JadeRenderer', function() {
    
    it('should setup properly', function() {
        expect(jade.data).toEqual({});
        expect(jade.headscripts).toEqual([]);
        expect(jade.footscripts).toEqual([]);
        expect(jade.templateFile).toEqual( __dirname + '/testtpl.jade' );
    });
    
    it('should render react components', function() {
        jade.addReact(react);
        expect(Object.keys(jade.data)).toEqual( ['react'] );
        expect(jade.footscripts[0]).toEqual( 'if(AppComponents["react"]) React.renderComponent(AppComponents["react"]('+JSON.stringify(cdata)+', document.querySelector("#react"));' );
    });
    
    it('should render jade with react components', function() {
        var html = jade.render()
          , component = jade.data.react;
        
        expect(html).toEqual('<html><head><title>Test</title></head><body><div id="react">' +component+ '</div></body></html>');
    });
    
});