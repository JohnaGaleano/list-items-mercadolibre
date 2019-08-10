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
        <p>$</p>{product.price}
      </div>
      <div className="ProductCard__seller-container text-truncate">
        {product.seller}
      </div>
    </div>
  );
}
let info = [];

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
    this.fetchProducts(this.state.item);
  };
  fetchProducts = async item => {
    info = [];
    this.setState({ loading: false, error: null });

    fetch(
      `https://api.mercadolibre.com/sites/MLU/search?q=${item}&access_token=APP_USR-6616257581210091-081000-b19e961dc11253afcf5910372627e572-307302477`
    )
      .then(res => res.json())
      .then(json => {
        console.log(json.results);

        Promise.all(
          json.results.map(element =>
            fetch(
              `https://api.mercadolibre.com/users/${element.seller.id}`
            ).then(res =>
              res.json().then(res => {
                info.push({
                  title: element.title,
                  thumbnail: element.thumbnail,
                  price: element.price,
                  seller: res.nickname
                });
                
              })
            )
            
          )
          
        ).then(res => {
          this.setState({
          loading: false,
          data: {
            results: [].concat(this.state.data.results, info)
          },
          nextPage: this.state.nextPage + 1
        });
        console.log(this.state.data.results);})
        
      });

    //////////////////////////////
    // try {
    //   const response = await fetch(
    //     `https://api.mercadolibre.com/sites/MLU/search?q=${item}&access_token=APP_USR-6616257581210091-080916-88f6f9e74cdf6ee80085621ddf1a48dc-307302477`
    //   );
    //   const data = await response.json();

    //   this.setState({
    //     loading: false,
    //     data: {
    //       info: data,
    //       results: [].concat(this.state.data.results, data.results)
    //     },
    //     nextPage: this.state.nextPage + 1
    //   });
    // } catch (error) {
    //   this.setState({ loading: false, error: error });
    // }
    ///////////////////////////
    console.log("info2: " + info);
  };

  handleSubmit = e => {
    e.preventDefault();
  };
  render() {
    return (
      <div>
        <div>
          {" "}
          <header>John Alexander Galeano - PAY Mercado Libre</header>{" "}
        </div>
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
