import { InputAdornment, TextField, TextFieldProps } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';

export type SearchFieldProps = Omit<TextFieldProps, 'onChange'> & { onChange?: (newSearchString: string) => void };

const SearchField = (props: SearchFieldProps): JSX.Element => {
    const { InputProps, onChange, ...other } = props;

    const handleChange =
        onChange &&
        ((event: React.ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.value);
        });

    return (
        <TextField
            variant="outlined"
            placeholder="Search"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
                ...InputProps,
            }}
            onChange={handleChange}
            {...other}
        />
    );
};

export default SearchField;
