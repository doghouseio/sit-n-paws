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
    } else {
      this.setState({query: ''});
      this.props.openLoginMessage();
    }
  }

  render() {
    return (
      <div>
        <input className="searchBar"
               placeholder="Search by ZIP!"
               value={this.state.query}
               type="text"
               onChange={event => this.onInputChange(event.target.value)} />
        </div>
      )
  }
}

export default Search;
