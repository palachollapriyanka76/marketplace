import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import Marketplace from '../abis/Marketplace.json'
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {

  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.request({ method: 'eth_requestAccounts' })
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Install MetaMask!')
    }
  }

  async loadBlockchainData() {
    console.log("START")

    const web3 = window.web3

    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    console.log("ACCOUNTS:", accounts)

    // Network
    const networkId = await web3.eth.net.getId()
    console.log("NETWORK ID:", networkId)

    const networkData = Marketplace.networks[networkId]
    console.log("NETWORK DATA:", networkData)

    if (networkData) {

      const marketplace = new web3.eth.Contract(
        Marketplace.abi,
        networkData.address
      )
      console.log("CONTRACT OK")

      this.setState({ marketplace })   // 🔥 IMPORTANT

      let productCount = await marketplace.methods.productCount().call()
      productCount = parseInt(productCount)

      console.log("PRODUCT COUNT:", productCount)

      // 🔥 LOAD PRODUCTS (YOU WERE MISSING THIS)
      let products = []

      for (let i = 1; i <= productCount; i++) {
        const product = await marketplace.methods.products(i).call()
        products.push(product)
      }

      // 🔥 FINAL STATE UPDATE
      this.setState({
        productCount,
        products,
        loading: false
      })

      console.log("DONE")

    } else {
      window.alert("Contract not deployed!")
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true,
      marketplace: null
    }

    this.createProduct = this.createProduct.bind(this)
    this.purchaseProduct = this.purchaseProduct.bind(this)
  }

  createProduct(name, price) {
    this.setState({ loading: true })

    this.state.marketplace.methods.createProduct(name, price)
      .send({ from: this.state.account })
      .once('receipt', async () => {
        await this.loadBlockchainData()
      })
  }

  async purchaseProduct(id) {
  this.setState({ loading: true })

  const product = await this.state.marketplace.methods.products(id).call()

  await this.state.marketplace.methods.purchaseProduct(id).send({
    from: this.state.account,
    value: product.price   // ✅ exact wei value
  })

  await this.loadBlockchainData()
}

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />

        <div className="container-fluid mt-5">
          <div className="row">
            <main className="col-lg-12 d-flex">

              {this.state.loading
                ? <h2>Loading...</h2>
                : <Main
                    products={this.state.products}
                    createProduct={this.createProduct}
                    purchaseProduct={this.purchaseProduct}
                  />
              }

            </main>
          </div>
        </div>
      </div>
    )
  }
}

export default App