import React from 'react';
import Autosuggest from 'react-autosuggest';
import axios from "axios";


class SearchBar extends React.Component {
    constructor() {
        super();

        //Define state for value and suggestion collection
        this.state = {
            value: '',
            suggestions: []
        };
    }

    // Filter logic
    getSuggestions = async (value) => {
        const inputValue = value.trim().toLowerCase();
        let response = await fetch("https://api.themoviedb.org/3/search/movie?api_key=ef959111db7fa4c60077b43c0c0a157e&language=en-US%2C%20el-GR&query=" + inputValue + "&page=1&include_adult=false");
        let data = await response.json()
        return data;
    };

    // Trigger suggestions
    getSuggestionValue = suggestion => suggestion.title;

    // Render Each Option
    renderSuggestion = suggestion => (
        <div class="z-50 bg-transparent min-w-100 flex items-center overflow-visible dark-h:bg-gray-700 dark:borger-black px-4 text-sm text-gray-700 shadow-b-2 border-gray-200">
            <div class="flex-shrink-0 h-8 w-8">
                {/* <img onClick={false} class="h-8 w-8 rounded-full" src={suggestion.Poster} /> */}
                {suggestion.poster_path && <img class="h-8 w-8 rounded-full" src={"https://image.tmdb.org/t/p/w300_and_h450_bestv2/" + suggestion.poster_path} />}
                {!suggestion.poster_path && <img class="h-8 w-8 rounded-full" src={"https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg"} />}
            </div>
            {/* <span className="icon-wrap"><img src={suggestion.Poster} /></span> */}
            <div class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-100">
                {suggestion.title}
            </div>
        </div>
    );

    // OnChange event handler
    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };

    // Suggestion rerender when user types
    onSuggestionsFetchRequested = ({ value }) => {
        this.getSuggestions(value)
            .then(data => {
                if (data.Error) {
                    this.setState({
                        suggestions: []
                    });
                } else {
                    this.setState({
                        suggestions: data.results
                    });
                }
            })
    };

    // Triggered on clear
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render() {
        const { value, suggestions } = this.state;

        // Option props
        const inputProps = {
            placeholder: 'Search movies',
            value,
            onChange: this.onChange,
        };

        // Adding AutoSuggest component
        return (
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
            />
        );
    }
}

export default SearchBar;