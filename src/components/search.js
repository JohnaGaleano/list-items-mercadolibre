import React from "react";
import "./styles.css";

function ProductCard(props) {
  const { product } = props;

  return (
    <div
      className="CharacterCard"
      style={{ backgroundImage: `url(${product.thumbnail})` }}
    >
      <div className="CharacterCard__name-container text-truncate">
        {product.title}
      </div>
    </div>
  );
}

const inicial = {
  show: false,
  item: "",
  loading: true,
  error: null,
  data: {
    info: {},
    results: []
  },
  nextPage: 1
};

class Search extends React.Component {
  state = {
    show: false,
    item: "",
    loading: true,
    error: null,
    data: {
      info: {},
      results: []
    },
    nextPage: 1
  };

  handleChange = e => {
    this.setState({ item: e.target.value });
  };

  handleClick = e => {
    this.setState(inicial);
    this.setState({ show: !this.state.show });
    console.log(this.state.data);
    
    this.fetchCharacters(this.state.item);
  };
  fetchCharacters = async item => {
    this.setState({ loading: false, error: null });

    try {
      const response = await fetch(
        `https://api.mercadolibre.com/sites/MLU/search?q=${item}&access_token=APP_USR-6616257581210091-080916-88f6f9e74cdf6ee80085621ddf1a48dc-307302477`
      );
      const data = await response.json();
        
      this.setState({
        loading: false,
        data: {
          info: data,
          results: [].concat(this.state.data.results, data.results)
        },
        nextPage: this.state.nextPage + 1
      });
    } catch (error) {
      this.setState({ loading: false, error: error });
    }
  };
  handleSubmit = e => {
    e.preventDefault();
  };
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Producto a buscar</label>
            <input
              onChange={this.handleChange}
              type="text"
              name="item"
              value={this.state.item}
            />
          </div>

          <button onClick={this.handleClick} className="btn btn-primary">
            Search on MercadoLibre
          </button>
        </form>

        <div>
            <ul className="row">
              {this.state.data.results.map(product => (
                <li className="col-6 col-md-3" key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
        </div>
      </div>
    );
  }
}

export default Search;
