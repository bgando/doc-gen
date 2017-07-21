const xlsx = require('node-xlsx');
const fs = require('fs');
const Handlebars = require('handlebars');

const dataFile = '/can-migrate-transforms-clean-v9.xlsx';

const obj = xlsx.parse(__dirname + dataFile);
const rows = obj[0].data; //all rows
rows.splice(0,1); //remove headings

Handlebars.registerHelper('toLowerCase', str => {
  return str.toLowerCase();
});


const source =
' GENERATED FROM ' + dataFile +
'{{#each rows as |component|}}\n'+
'### {{{component.[0]}}}\n'+
' \n'+
'To run [all of the {{{component.[0]}}} transforms](https://github.com/canjs/can-migrate/tree/master/src/transforms/{{{component.[0]}}}) listed below:\n'+
' \n'+
'```\n'+
'can-migrate -a **/*.js -t {{{component.[0]}}}/\n'+
'```\n'+
' \n'+
'{{#if component.[11]}}\n'+ //if there is a replace.js script
'#### {{{component.[0]}}}/replace\n'+
' \n'+
'Running this transform:\n'+
' \n'+
'```\n'+
'can-migrate -a **/*.js -t {{{component.[0]}}}/replace.js\n'+
'```\n'+
' \n'+
'…will transform code like this:\n'+
' \n'+
'```js\n'+
'import can from "can";\n'+
'{{#if component.[4]}}\n'+ //if there is a code snippet, use it
'{{{component.[4]}}}\n'+
'{{/if}}\n'+
'```\n'+
' \n'+
'…to this:\n'+
' \n'+
'```js\n'+
'import {{{component.[3]}}} from "{{{component.[2]}}}";\n'+
'import can from "can";\n'+
'{{#if component.[5]}}\n'+ //if there is a code snippet, use it
'{{{component.[5]}}}\n'+
'{{/if}}\n'+
'```\n'+
'@highlight 1,3,5\n'+
'{{/if}}\n'+
'{{#if component.[6]}}\n'+ //if there are import/require transforms
'#### {{{component.[0]}}}/import\n' +
'Running this transform:\n' +
'```\n' +
'can-migrate -a **/*.js -t {{{component.[0]}}}/import.js\n' +
'```\n' +
'...will transform any of the following:\n' +
'```js\n' +
'{{#unless component.[7]}}\n' + //if the URL is normal, default
'import {{{component.[1]}}} from "can/{{{toLowerCase component.[1]}}}/";\n' +
'import {{{component.[1]}}} from "can/{{{toLowerCase component.[1]}}}/{{{toLowerCase component.[1]}}}";\n' +
'import {{{component.[1]}}} from "can/{{{toLowerCase component.[1]}}}/{{{toLowerCase component.[1]}}}.js";\n' +
'{{else}}\n' + //otherwise get paths
'{{log "else"}}' +
'{{log component.[8]}}'+
'import {{{component.[1]}}} from "can/{{{toLowerCase component.[8]}}}/{{{toLowerCase component.[9]}}}/";\n' +
'import {{{component.[1]}}} from "can/{{{toLowerCase component.[8]}}}/{{{toLowerCase component.[9]}}}/{{{toLowerCase component.[9]}}}";\n' +
'import {{{component.[1]}}} from "can/{{{toLowerCase component.[8]}}}/{{{toLowerCase component.[9]}}}/{{{toLowerCase component.[9]}}}.js";\n' +
'{{/unless}}\n' +
'```\n' +
'...to this:\n' +
'```js\n' +
'import {{{component.[3]}}} from "{{{component.[2]}}}";\n' +
'```\n' +
'@highlight 1\n'+
'#### {{{component.[0]}}}/require\n' +
'Running this transform:\n' +
'```\n' +
'can-migrate -a **/*.js -t {{{component.[0]}}}/require.js\n' +
'```\n' +
'...will transform any of the following:\n' +
'```js\n' +
'{{#unless component.[7]}}\n' + //if the URL is normal, default
'const {{{component.[1]}}} = require("can/{{{toLowerCase component.[1]}}}/");\n' +
'const {{{component.[1]}}} = require("can/{{{toLowerCase component.[1]}}}/{{{toLowerCase component.[1]}}}");\n' +
'const {{{component.[1]}}} = require("can/{{{toLowerCase component.[1]}}}/{{{toLowerCase component.[1]}}}.js");\n' +
'{{else }}\n' + //otherwise get paths
'{{log "else"}}' +
'{{log component.[8]}}' +
'const {{{component.[1]}}} = require("can/{{{toLowerCase component.[8]}}}/{{{toLowerCase component.[9]}}}/");\n' +
'const {{{component.[1]}}} = require("can/{{{toLowerCase component.[8]}}}/{{{toLowerCase component.[9]}}}/{{{toLowerCase component.[9]}}}");\n' +
'const {{{component.[1]}}} = require("can/{{{toLowerCase component.[8]}}}/{{{toLowerCase component.[9]}}}/{{{toLowerCase component.[9]}}}.js");\n' +
'{{/unless }}\n' +
'```\n' +
'...to this:\n' +
'```js\n' +
'const {{{component.[3]}}} = require("{{{component.[2]}}}");\n' +
'```\n' +
'@highlight 1\n'+
'{{/if}}\n'+
'{{/each}}';

const template = Handlebars.compile(source);
 
const contents = template({rows: rows});

fs.writeFile('contents.html', contents, err => {
    if (err) {
        return console.error('Failed to store template: ${err.message}.');
    }

    console.log('Saved template!');
});
