import TabsProduit from '@/components/products';

export default function Produits() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Nos Produits</h1>
      <TabsProduit />
    </div>
  );
}
