import Product from './components/Product';
import { ProductType } from './types';
import { useCallback, useEffect, useState } from 'react';
import './App.css';

const snipcartApiToken =
  process.env.REACT_APP_SNIPCART_API_KEY ||
  'OWE3MmZmMjQtNTk3Yi00OThhLWEwMmUtZDY4ZWM4NzIwYzZiNjM2NjM0Mzc1NzE0MTUwNzI1';

const datocmsPublishedContentCdaToken =
  process.env.REACT_APP_DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN;

async function fetchProductsFromDatoCMS(): Promise<ProductType[]> {
  if (!datocmsPublishedContentCdaToken) {
    throw new Error('Missing REACT_APP_DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN');
  }

  const response = await fetch('https://graphql.datocms.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${datocmsPublishedContentCdaToken}`,
    },
    body: JSON.stringify({
      query: `
        {
          allProducts {
            id
            name
            description
            price
            image {
              url
              alt
              title
            }
          }
        }
      `,
    }),
  });

  const { data, errors } = await response.json();

  if (!response.ok || errors) {
    throw new Error(`Failed to fetch products: ${JSON.stringify(errors)}`);
  }

  return data.allProducts;
}

export default function App() {
  const [products, setProducts] = useState<ProductType[] | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const products = await fetchProductsFromDatoCMS();

      setProducts(products);
    } catch (error) {
      console.error(error);
      setProducts([]);
    }
  }, [setProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="container">
      <main className="main">
        <h1>E-Commerce built with React + SnipCart + DatoCMS</h1>

        <div className="grid">
          {products &&
            products.map((product, i) => <Product product={product} key={i} />)}
        </div>
      </main>
      <div
        id="snipcart"
        data-config-modal-style="side"
        data-api-key={snipcartApiToken}
        hidden
      ></div>
    </div>
  );
}
