const xlsx = require('node-xlsx');
const fs = require('fs');
const Handlebars = require('handlebars');

const obj = xlsx.parse(__dirname + '/test-w-import.xlsx');
const data = obj[0].data;
data.splice(0,1);

Handlebars.registerHelper('toLowerCase', function(str) {
  return str.toLowerCase();
});


// const source = '{{#each data}}{{#each this}}<div>{{this}}</div>{{/each}}{{/each}}';

const source =
'{{#each data as |component index|}}\n'+
'### {{component.[0]}}\n'+
' \n'+
'To run [all of the {{component.[0]}} transforms](https://github.com/canjs/can-migrate/tree/master/src/transforms/{{component.[0]}}) listed below:\n'+
' \n'+
'```\n'+
'can-migrate -a **/*.js -t {{component.[0]}}/\n'+
'```\n'+
' \n'+
'#### {{component.[0]}}/replace\n'+
' \n'+
'Running this transform:\n'+
' \n'+
'```\n'+
'can-migrate -a **/*.js -t {{component.[0]}}/replace.js\n'+
'```\n'+
' \n'+
'…will transform code like this:\n'+
' \n'+
'```js\n'+
'import can from "can";\n'+
'{{component.[2]}}(42);\n'+
'```\n'+
' \n'+
'…to this:\n'+
' \n'+
'```js\n'+
'import {{component.[1]}} from "{{component.[0]}}";\n'+
'```\n'+
'{{#if component.[3]}}\n'+
'#### {{component.[0]}}/import\n' +
'Running this transform:\n' +
'```\n' +
'can-migrate -a **/*.js -t {{component.[0]}}/import.js\n' +
'```\n' +
'...will transform any of the following:\n' +
'```js\n' +
'import {{component.[1]}} from "can/{{toLowerCase component.[1]}}/";\n' +
'import {{component.[1]}} from "can/{{toLowerCase component.[1]}}/{{toLowerCase component.[1]}}";\n' +
'import {{component.[1]}} from "can/{{toLowerCase component.[1]}}/{{toLowerCase component.[1]}}.js";\n' +
'```\n' +
'...to this:\n' +
'```js\n' +
'import {{component.[1]}} from "{{component.[0]}}";\n' +
'```\n' +
'#### {{component.[0]}}/require\n' +
'Running this transform:\n' +
'```\n' +
'can-migrate -a **/*.js -t {{component.[0]}}/require.js\n' +
'```\n' +
'...will transform any of the following:\n' +
'```js\n' +
'const {{component.[1]}} = require("can/{{toLowerCase component.[1]}}/");\n' +
'const {{component.[1]}} = require(can/{{toLowerCase component.[1]}}/{{toLowerCase component.[1]}}");\n' +
'const {{component.[1]}} = require( "can/{{toLowerCase component.[1]}}/{{toLowerCase component.[1]}}.js");\n' +
'```\n' +
'...to this:\n' +
'```js\n' +
'const {{component.[1]}} = require("{{component.[0]}}");\n' +
'```\n' +
'{{/if}}\n'+
'{{/each}}';

const template = Handlebars.compile(source);

console.log(data)

for(let i = 0; i < data; i++) {

} 
const contents = template({data: data});

fs.writeFile('contents.html', contents, err => {
    if (err) {
        return console.error('Autsch! Failed to store template: ${err.message}.');
    }

    console.log('Saved template!');
});
