/** @jsx React.DOM */

var React = require('react/addons');

module.exports = React.createClass({
    
    render: function() {
        
        return <p>Hello {this.props.hello}!</p>;
    }
    
});