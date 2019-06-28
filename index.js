var through = require('through2');
var rework = require('rework');
var stringify = require('css-stringify');
var dirname = require('path').dirname;
var pathjoin = require('path').join;

module.exports = function (options) {
    return through.obj(function (file, enc, callback) {
        let stream = this;
        let cssString = file.contents.toString();
        let reworkData = rework(cssString, {});
        let sheets = {};
        let rules = reworkData.obj.stylesheet.rules;

        options.extraSheets.forEach(item => {
            sheets[item.filename] = {
                type: 'stylesheet',
                stylesheet: {
                    rules: []
                }
            }
        });

        sheets[options.mainFileName] = {
            type: 'stylesheet',
            stylesheet: {
                rules: []
            }
        };


        for (let i = 0; i < rules.length; i++) {
            let rule = rules[i];

            if (rule.type !== 'rule') {
                sheets[options.mainFileName].stylesheet.rules = [...sheets[options.mainFileName].stylesheet.rules, rule];
                continue;
            }

            if (!rule.selectors) {
                continue;
            }


            let f = false;
            for (let i = 0; i < options.extraSheets.length; i++) {
                let {
                    selector,
                    filename
                } = options.extraSheets[i];

                if (rule.selectors.find(s => s.includes(selector))) {
                    sheets[filename].stylesheet.rules = [...sheets[filename].stylesheet.rules, rule];
                    f = true;
                    break;
                }
            }

            if (!f) {
                sheets[options.mainFileName].stylesheet.rules = [...sheets[options.mainFileName].stylesheet.rules, rule];
            }
        }




        for (let key of Object.keys(sheets)) {
            let _file = file.clone({
                contents: false
            });

            let name = key;

            _file.contents = Buffer.from(stringify(sheets[key]));
            if (!_file.contents) {
                continue;
            }

            if (!name.includes('.css')) {
                name = name + '.css';
            }

            _file.path = pathjoin(dirname(_file.path), name);
            stream.push(_file);
        }

        callback();
    });
};