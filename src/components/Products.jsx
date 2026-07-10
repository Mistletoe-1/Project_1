import Icon from './Icons.jsx';

export function ProductsView({ products, search, onRestock }) {
  const visibleProducts = products.filter((product) => {
    const keyword = search.trim().toLowerCase();
    return !keyword || `${product.name}${product.category}${product.id}`.toLowerCase().includes(keyword);
  });

  return (
    <div className="productGrid">
      {visibleProducts.map((product) => {
        const stockRate = Math.min(100, Math.round((product.stock / (product.alert * 2)) * 100));
        const isLow = product.stock < product.alert;

        return (
          <article className={`productCard ${isLow ? 'needsStock' : ''}`} key={product.id}>
            <div className="productVisual">
              <span>{product.category.slice(0, 1)}</span>
            </div>
            <div className="productBody">
              <div className="productHead">
                <div>
                  <small>{product.id}</small>
                  <h2>{product.name}</h2>
                </div>
                <span className={isLow ? 'status 售后中' : 'status 已完成'}>{isLow ? '需补货' : '正常'}</span>
              </div>
              <div className="productMetrics">
                <span><strong>{product.stock}</strong>库存</span>
                <span><strong>{product.sales}</strong>销量</span>
                <span><strong>¥{product.price}</strong>售价</span>
              </div>
              <div className="stockBar">
                <span style={{ width: `${stockRate}%` }} />
              </div>
              <button className="secondaryButton" onClick={() => onRestock(product.id)} type="button">
                <Icon name="plus" size={16} />
                快速补货 24 件
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
