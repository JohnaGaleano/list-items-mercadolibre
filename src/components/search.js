import React from "react";
import "./styles.css";

function ProductCard(props) {
  const { product } = props;

  return (
    <div
      className="ProductCard"
      style={{ backgroundImage: `url(${product.thumbnail})` }}
    >
      <div className="ProductCard__name-container text-truncate">
        {product.title}
      </div>
      <div className="ProductCard__price-container text-truncate">
        <p>$</p>
        {product.price}
      </div>
      <div className="ProductCard__seller-container text-truncate">
        {product.seller}
      </div>
    </div>
  );
}

let info = [];

const inicial = {
  item: "",
  data: {
    results: []
  },
  nextPage: 1
};

class Search extends React.Component {
  state = {
    item: "",
    data: {
      results: []
    }
  };

  handleChange = e => {
    this.setState({ item: e.target.value });
  };

  handleClick = e => {
    this.setState(inicial);
    this.fetchProducts(this.state.item);
  };

  fetchProducts = async item => {
    info = [];
    fetch(
      `https://api.mercadolibre.com/sites/MLU/search?q=${item}&access_token=APP_USR-6616257581210091-081000-b19e961dc11253afcf5910372627e572-307302477`
    )
      .then(res => res.json())
      .then(data => {
        Promise.all(
          data.results.map(element =>
            fetch(`https://api.mercadolibre.com/users/${element.seller.id}`)
              .then(res => res.json())
              .then(res => {
                info.push({
                  title: element.title,
                  thumbnail: element.thumbnail,
                  price: element.price,
                  seller: res.nickname
                });
              })
          )
        ).then(() => {
          this.setState({
            data: {
              results: [].concat(this.state.data.results, info)
            }
          });
        });
      });
  };

  handleSubmit = e => {
    e.preventDefault();
  };
  render() {
    return (
      <div>
        <div>
          <div className="header" >John Alexander Galeano Ospina- Mercadolibre</div>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="input">
            <label>Item</label>
            <input
              onChange={this.handleChange}
              type="text"
              name="item"
              value={this.state.item}
            />
          </div>

          <button onClick={this.handleClick} className="button-search">
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
