import React, { Component } from 'react'

class Main extends Component {
  render() {
    return (
      <div className="container">

        <h2 className="text-center mt-4">🛒 Add Product</h2>

        <form
          className="d-flex justify-content-center gap-2 mt-3"
          onSubmit={(event) => {
            event.preventDefault()
            const name = this.productName.value
            const price = window.web3.utils.toWei(
              this.productPrice.value.toString(), 'Ether'
            )
            this.props.createProduct(name, price)
          }}
        >

          <input
            type="text"
            placeholder="Product Name"
            ref={(input) => (this.productName = input)}
            className="form-control w-25"
            required
          />

          <input
            type="text"
            placeholder="Price (ETH)"
            ref={(input) => (this.productPrice = input)}
            className="form-control w-25"
            required
          />

          <button className="btn btn-primary">Add</button>
        </form>

        <hr />

        <h2 className="text-center mt-4">🛍️ Products</h2>

        <div className="row mt-4">
          {this.props.products.map((product, key) => {
            return (
              <div className="col-md-3 mb-4" key={key}>
                <div className="card shadow p-3">

                  <h5>{product.name}</h5>

                  <p>
                    💰 {window.web3.utils.fromWei(
                      product.price.toString(),
                      'Ether'
                    )} ETH
                  </p>

                  <small>Owner:</small>
                  <p style={{ fontSize: "12px" }}>
                    {product.owner}
                  </p>

                  {!product.purchased ? (
                    <button
                      className="btn btn-success"
                      onClick={() =>
                        this.props.purchaseProduct(product.id)
                      }
                    >
                      Buy
                    </button>
                  ) : (
                    <button className="btn btn-secondary" disabled>
                      Purchased
                    </button>
                  )}

                </div>
              </div>
            )
          })}
        </div>

      </div>
    )
  }
}

export default Main