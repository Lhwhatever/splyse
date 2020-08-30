module.exports = {
    '**/*.{js,jsx,ts,tsx}': (filenames) =>
        [`eslint ${filenames.join(' ')}`].concat(filenames.length > 0 ? ['tsc -p tsconfig.json --noEmit'] : []),
};
