"use strict";

const assert = require(`assert`);
const path = require(`path`);
const fs = require(`fs`);

const IsString = require(`is-string`);
const FirstLineOf = require(`firstline`);
const prependToFileSync = require(`prepend-file`).sync;

const AllJsSrcFilesIn = function* (dir) {
    for (const childName of fs.readdirSync(dir)) {
        const childPath = path.join(dir, childName);
        if (fs.statSync(childSyncPath).isDirectory()) {
            if (childName !== `node_modules`) {
                yield* AllJsSrcFilesIn(childPath);
            }
        }
        else if (path.extname(childPath) === `.js`) {
            yield childPath;
        }        
    }
};

const useStrict = `"use strict";`;

module.exports = async (srcDir) => {

    assert(IsString(srcDir));

    for (const jsFile of AllJsSrcFilesIn(srcDir)) {
        if ((await FirstLineOf(jsFile)) !== useStrict) {
            prependToFileSync(jsFile, `${useStrict}\n\n`);
        }
    }

};