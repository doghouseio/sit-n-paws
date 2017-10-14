import React from 'react';

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      query: '',
    }
  }

  //handles input in search
  onInputChange(query) {
    this.setState({query});
    if (this.props.authLogin()) {
      this.props.onChange(query);
    }
  }

  render() {
    return (
      <div>
        <input className="searchBar"
               placeholder={this.props.authLogin() ? "Search by ZIP!" : "Login to search"}
               type="text"
               onChange={event => this.onInputChange(event.target.value)} />
        </div>
      )
  }
}

export default Search;
