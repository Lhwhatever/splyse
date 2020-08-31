module.exports = {
    '**/*.{js,jsx,ts,tsx}': (filenames) =>
        [`eslint --fix ${filenames.join(' ')}`].concat(filenames.length > 0 ? ['tsc -p tsconfig.json --noEmit'] : []),
};
