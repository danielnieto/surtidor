import './App.css';
import { useState, useEffect, useMemo } from 'react';
import { Card } from '@mui/material';


import FilePicker from './FilePicker';
import TabsLayout from './TabsLayout';


class Product {
  constructor(code, name, quantity) {
    this.code = code;
    this.name = name;
    this.quantity = quantity;
  }
}

function App() {

  const [outOfStock, setOutOfStock] = useState([]);
  const [inStock, setInStock] = useState([]);
  const [products, setProducts] = useState([]);

  const inStockProductsQuantity = useMemo(() => inStock.reduce((acc, product) => {
    acc[product.code] = product.quantity;
    return acc;
   }, {}), [inStock]);

  useEffect(() => {
    if (outOfStock.length === 0 || inStock.length === 0) {
      return;
    }

    setProducts(
      outOfStock.filter(product => {
        return inStockProductsQuantity[product.code] > 0;
      }).map(product => new Product(product.code, product.name, inStockProductsQuantity[product.code]))
    );

  }, [outOfStock, inStock, inStockProductsQuantity]);

  function parseRow(row) {
    return {
      code: row[0],
      name: row[1],
      purchasePrice: parseFloat(row[2], 10),
      salePrice: parseFloat(row[3], 10),
      wholesalePrice: parseFloat(row[4], 10),
      quantity: parseInt(row[5], 10),
      minInventory: parseInt(row[6], 10),
      maxInventory: parseInt(row[7], 10),
      department: row[8],
    }
  }

  function onChangeOutOfStock(rows) {
    setOutOfStock(rows.slice(1).map(parseRow).map(parsed => new Product(parsed.code, parsed.name, parsed.quantity)));
  }

  function onChangeInStock(rows) {
    setInStock(rows.slice(1).map(parseRow).map(parsed => new Product(parsed.code, parsed.name, parsed.quantity)));
  }

  return (
    <div className="App">
      {
        products.length === 0 && (<Card variant="outlined" style={{padding: "2em", margin: "2em auto 0 auto", maxWidth: '800px'}}>
          { outOfStock.length === 0 && <FilePicker onChange={onChangeOutOfStock} label="Selecciona el archivo de Faltantes"/> }
          { outOfStock.length > 0 && inStock.length === 0 && <FilePicker onChange={onChangeInStock} label="Selecciona el archivo de Inventario"/> }
        </Card>)
      }

      { products.length > 0 && <TabsLayout outOfStockProducts={outOfStock} inStockProducts={inStock} restockableProducts={products} />}

    </div>
  );
}

export default App;
