# Jade

Handles rendering jade templates and passing through init data to clientside engines (React)


****

## JadeRenderer.constructor

*	*cfg* `Object` may have the following
	- templateFile: string path to jade template
	- template: string of jade to render
	- options: jade configuration options
	- data: template data

****

## JadeRenderer.addData() 

Augment data before rendering

*	*moreData* `Object` undefined

****

## JadeRenderer.addReact()

Adds a React component as an object and preps component HTML and initialization hooks

*	*name* `String` (optional) of React component to match the variable you'd like passed to the Jade template, otherwise uses the name of the `component` param
*	*component* `Object` as an instance of ReactRenderer
*	*returns* `Object` itself for chaining

****

## JadeRenderer.injectScript() 

Queues script to add to HTML on render()

*	*script* `String` to add
*	*inHead* `Boolean` if true, appends script to doc head, otherwise to body

****

## JadeRenderer.render() 

Render and return HTML

*	*returns* `String` html